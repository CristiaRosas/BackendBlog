import { response, request } from "express";
import Publication from "./publication.model.js";
import Course from "../courses/course.model.js";

export const postPublication = async (req, res) => {
    try {
        const data = req.body;

        const maping = await Course.find({ name: { $in: data.course } });

        data.course = maping.map(course => course._id);

        const publication = new Publication(data);

        await publication.save();

    
        await publication.populate('course', 'name')

        res.status(200).json({
            success: true,
            message: 'Publicación guardada exitosamente!',
            publication
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al guardar la publicación!',
            error
        })
    }
}

export const getPublications = async (req = request, res = response) => {
    try {
        const { limite = 10, desde = 0 } = req.query;
        const query = { status: true };

        const [total, publications] = await Promise.all([
            Publication.countDocuments(query),
            Publication.find(query)
                .skip(Number(desde))
                .limit(Number(limite))
                .populate('course', 'name')
        ])

        res.status(200).json({
            success: true,
            message: 'Publicaciones encontradas!',
            total,
            publications
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            msg: 'Error al obtener publicaciones!',
            error
        })
    }
}

export const getPublicationById = async (req, res) => {
    try {
        const { id } = req.params;

        const publication = await Publication.findById(id).populate('course', 'name');

        res.status(200).json({
            success: true,
            message: 'Publicación encontrada!',
            publication
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            msg: 'Error al obtener la publicación!',
            error
        })
    }
}

export const getPublicationByTitle = async (req, res) => {
    try {
        const { title } = req.params;

        const publication = await Publication.findOne({ title }).populate('course', 'name');

        if (!publication) {
            return res.status(404).json({
                success: false,
                msg: 'Publicación no encontrada!'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Publication found!',
            publication
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            msg: 'Error al obtener la publicación!',
            error: error.message
        });
    }
};

export const getPublicationsByCourseName = async (req, res) => {
    try {
        const { name } = req.params;

        const course = await Course.findOne({ name });

        if (!course) {
            return res.status(404).json({
                success: false,
                msg: 'Curso no encontrado!'
            });
        }

        const publications = await Publication.find({ course: course._id }).populate('course', 'name');

        res.status(200).json({
            success: true,
            msg: 'Publicaciones encontradas!',
            publications
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            msg: 'Error al obtener publicaciones!',
            error: error.message
        });
    }
};

export const putPublication = async (req, res = response) => {
    try {

        const { id } = req.params;
        const data = req.body;

        const maping = await Course.find({ name: { $in: data.course } });

        data.course = maping.map(course => course._id);

        const publication = await Publication.findByIdAndUpdate(id, data, { new: true }).populate('course', 'name');

        res.status(200).json({
            success: true,
            msg: 'Actualización de la publicación!',
            publication
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            msg: 'Actualización de errores!',
            error
        })
    }
}

export const deletePublication = async (req, res) => {
    try {

        const { id } = req.params;

        const publication = await Publication.findByIdAndUpdate(id, { status: false }, { new: true });

        res.status(200).json({
            success: true,
            msg: 'Desactivar publicación!',
            publication,
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            msg: 'Desactivar error!',
            error
        })
    }
}