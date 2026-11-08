import { useForm, type SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { NavLink } from "react-router";
import type ProductoraCreacion from "../modelos/ProductoraCreacion.model";
import Boton from "../../../componentes/Boton";
import SeleccionarImagen from "../../../componentes/SeleccionarImagen";
import { fechaNoAnteriorA1900, fechaNoPuedeSerFutura, primeraLetraMayuscula } from "../../../validaciones/Validaciones";

export default function FormularioProductora(props: FormularioProductoraProps) {

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors, isValid, isSubmitting }
    } = useForm<ProductoraCreacion>({
        resolver: yupResolver(reglasDeValidacion),
        mode: 'onChange',
        defaultValues: props.modelo ?? { nombre: '', sitioWeb: '' }
    });

    const logoActualURL: string | undefined = props.modelo?.logo ? props.modelo.logo as string : undefined;

    return (
        <form onSubmit={handleSubmit(props.onSubmit)}>
            <div className="form-group">
                <label htmlFor="nombre">Nombre</label>
                <input type="text" id="nombre" autoComplete="off" className="form-control" {...register('nombre')} />
                {errors.nombre && <p className="error">{errors.nombre.message}</p>}
            </div>

            <div className="form-group">
                <label htmlFor="fechaFundacion">Fecha de fundación</label>
                <input type="date" id="fechaFundacion" className="form-control" {...register('fechaFundacion')} />
                {errors.fechaFundacion && <p className="error">{errors.fechaFundacion.message}</p>}
            </div>

            <div className="form-group">
                <label htmlFor="sitioWeb">Sitio web</label>
                <input type="text" id="sitioWeb" autoComplete="off" className="form-control" {...register('sitioWeb')} />
                {errors.sitioWeb && <p className="error">{errors.sitioWeb.message}</p>}
            </div>

            <SeleccionarImagen label="Logo" imagenURL={logoActualURL}
                imagenSeleccionada={logo => setValue('logo', logo)} />

            <div className="mt-2">
                <Boton type="submit" disabled={!isValid || isSubmitting}>
                    {isSubmitting ? 'Enviando...' : 'Enviar'}</Boton>
                <NavLink className="btn btn-secondary ms-2" to="/productoras">Cancelar</NavLink>
            </div>
        </form>
    )
}

interface FormularioProductoraProps {
    modelo?: ProductoraCreacion;
    onSubmit: SubmitHandler<ProductoraCreacion>;
}

const reglasDeValidacion = yup.object({
    nombre: yup.string().required('El nombre es obligatorio').test(primeraLetraMayuscula()),
    fechaFundacion: yup.string().required('La fecha de fundación es obligatoria')
        .test(fechaNoPuedeSerFutura()).test(fechaNoAnteriorA1900()),
    sitioWeb: yup.string().required('El sitio web es obligatorio').url('Debe ser una URL válida')
})
