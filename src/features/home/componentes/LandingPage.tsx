import { useState, useEffect } from "react";
import clienteAPI from "../../../api/clienteAxios";
import ListadoPeliculas from "../../peliculas/componentes/ListadoPeliculas";
import type Pelicula from "../../peliculas/modelos/pelicula.model";

export default function LandingPage() {
    const [peliculas, setPeliculas] = useState<LandingPageDTO>();

    useEffect(() => {
        clienteAPI.get<LandingPageDTO>('/peliculas/landing')
            .then(res => setPeliculas(res.data))
            .catch(() => setPeliculas({ enCines: [], proximosEstrenos: [] }));
    }, []);

    return (
        <>
            <h3>En Cines</h3>
            <ListadoPeliculas peliculas={peliculas?.enCines} />

            <h3>Próximos Estrenos</h3>
            <ListadoPeliculas peliculas={peliculas?.proximosEstrenos} />
        </>
    )
}

interface LandingPageDTO {
    enCines: Pelicula[];
    proximosEstrenos: Pelicula[];
}
