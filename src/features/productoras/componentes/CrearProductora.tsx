import type { SubmitHandler } from "react-hook-form";
import FormularioProductora from "./FormularioProductora";
import type ProductoraCreacion from "../modelos/ProductoraCreacion.model";

const onSubmit: SubmitHandler<ProductoraCreacion> = async (data) => {
    console.log('creando productora...');
    await new Promise(resolve => setTimeout(resolve, 2000));
    console.log(data);
}

export default function CrearProductora() {
    return (
        <>
            <h3>Crear Productora</h3>
            <FormularioProductora onSubmit={onSubmit} />
        </>
    )
}
