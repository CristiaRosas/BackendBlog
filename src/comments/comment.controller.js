import { response, request } from "express";
import Comment from "./comment.model.js";
import Publication from "../publications/publication.model.js";

export const postComment = async (req, res) => {
    try {
        const data = req.body;

        // Si no se proporciona el autor, asignar "Anonymous"
        if (!data.author || data.author.trim() === '') {
            data.author = 'Anonymous';
        }

        const maping = await Publication.findOne({ title: data.publication });

        if (!maping) {
            return res.status(404).json({
                success: false,
                message: 'Publicación no encontrada!',
            });
        }

        data.publication = maping._id;

        const comment = new Comment(data);

        await comment.save();
        await comment.populate({ path: 'publication', select: 'title', populate: { path: 'course', select: 'name'}});

        res.status(200).json({
            success: true,
            message: 'Comentario guardado exitosamente!',
            comment
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al guardar comentario!',
            error
        });
    }
};

export const getComments = async (req = request, res = response) => {
    try {
        const { limite = 10, desde = 0 } = req.query;
        const query = { status: true };

        const [total, comments] = await Promise.all([
            Comment.countDocuments(query),
            Comment.find(query)
                .skip(Number(desde))
                .limit(Number(limite))
                .populate({ path: 'publication', select: 'title', populate: { path: 'course', select: 'name'}})
        ])

        res.status(200).json({
            success: true,
            message: 'Comentarios encontrados!',
            total,
            comments
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            msg: 'Error al obtener comentarios!',
            error
        })
    }
}

export const getCommentById = async (req, res) => {
    try {
        const { id } = req.params;

        const comment = await Comment.findById(id).populate({ path: 'publication', select: 'title', populate: { path: 'course', select: 'name'}});

        if (!comment) {
            return res.status(404).json({
                success: false,
                msg: 'Comentario no encontrado!'
            })
        }

        res.status(200).json({
            success: true,
            message: 'Comentario encontrado!',
            comment
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            msg: 'Error al recibir el comentario!',
            error
        })
    }
}

export const getCommentByPublication = async (req, res) => {
    try {
        const { title } = req.params;

        const publication = await Publication.findOne({ title });

        const comments = await Comment.find({ publication: publication._id, status: true }).populate('publication', 'title').populate({ path: 'publication', populate: { path: 'course', select: 'name' }});

        res.status(200).json({
            success: true,
            message: 'Comentario encontrado!',
            comments
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            msg: 'Error al obtener comentarios para la publicación!',
            error: error.message
        });
    }
};

export const putComment = async (req, res = response) => {
    try {

        const { id } = req.params;
        const data = req.body;

        const maping = await Publication.findOne({ title: data.publication });

        data.publication = maping._id;

        const comment = await Comment.findByIdAndUpdate(id, data, { new: true }).populate({ path: 'publication', select: 'title', populate: { path: 'course', select: 'name'}});

        res.status(200).json({
            success: true,
            msg: 'Actualización de comentarios!',
            comment
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            msg: 'Actualización de errores!',
            error
        })
    }
}

export const deleteComment = async (req, res) => {
    try {

        const { id } = req.params;

        const comment = await Comment.findByIdAndUpdate(id, { status: false }, { new: true });


        res.status(200).json({
            success: true,
            msg: 'Desactivar comentario!',
            comment,
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            msg: 'Desactivar error!',
            error
        })
    }
}