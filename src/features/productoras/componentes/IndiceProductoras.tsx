import { useNavigate } from "react-router";
import Boton from "../../../componentes/Boton";

export default function IndiceProductoras() {
    const navigate = useNavigate();

    return (
        <>
            <h3>Productoras</h3>
            <Boton onClick={() => navigate('/productoras/crear')}>Crear Productora</Boton>
        </>
    )
}
