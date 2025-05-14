import { response, request } from "express";
import Course from "./course.model.js";

export const postCourse = async (req, res) => {
    try {
        const data = req.body;

        const course = new Course(data);

        await course.save();

        res.status(200).json({
            success: true,
            message: 'Curso guardado exitosamente!',
            course
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al guardar el curso!',
            error
        })
    }
}

export const getCourses = async (req = request, res = response) => {
    try {
        const { limite = 10, desde = 0 } = req.query;
        const query = { status: true };

        const [total, courses] = await Promise.all([
            Course.countDocuments(query),
            Course.find(query)
                .skip(Number(desde))
                .limit(Number(limite))
        ])

        res.status(200).json({
            success: true,
            total,
            courses
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            msg: 'Error al obtener cursos!',
            error
        })
    }
}

export const getCourseById = async (req, res) => {
    try {
        const { id } = req.params;

        const course = await Course.findById(id);

        if (!course) {
            return res.status(404).json({
                success: false,
                msg: 'Curso no encontrado!'
            })
        }

        res.status(200).json({
            success: true,
            course
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            msg: 'Error al obtener el curso!',
            error
        })
    }
}

export const getCourseByName = async (req, res) => {
    try {
        const { name } = req.params;

        const course = await Course.findOne({ name });

        if (!course) {
            return res.status(404).json({
                success: false,
                msg: 'Curso no encontrado!'
            });
        }

        res.status(200).json({
            success: true,
            course
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            msg: 'Error al obtener el curso!',
            error: error.message
        });
    }
};

export const putCourse = async (req, res = response) => {
    try {

        const { id } = req.params;
        const data = req.body;

        const course = await Course.findByIdAndUpdate(id, data, { new: true });

        res.status(200).json({
            success: true,
            msg: 'Actualización del curso!',
            course
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            msg: 'Actualización de errores!',
            error
        })
    }
}

export const deleteCourse = async (req, res) => {
    try {

        const { id } = req.params;

        const course = await Course.findByIdAndUpdate(id, { status: false }, { new: true });


        res.status(200).json({
            success: true,
            msg: 'Desactivar curso!',
            course,
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            msg: 'Desactivar error!',
            error
        })
    }
}

const createCoursesD = async (name, description, status) => {
    try {
        if(name === "Taller III" || name === "Tecnologia III" || name === "Practica Supervisada"){
            const existCourse = await Course.findOne({ name: "Taller III" || "Tecnologia III" });
            if(existCourse){
                console.log(`el curso ${name} ya existen.`);
                return null;
            };
        };
        const newCourse = new Course({
            name,
            description,
            status
        });
 
        await newCourse.save();
        console.log("Curso creado exitosamente: ", newCourse);
        return newCourse;
 
    } catch (error) {
        console.error("Error en el curso creado", error);
        return null;
    }
}
 
createCoursesD("Taller III",  true);
createCoursesD("Tecnologia III",  true);
createCoursesD("Practica Supervisada", true);
 