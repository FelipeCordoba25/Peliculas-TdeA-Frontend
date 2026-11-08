import { useEffect, useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import clienteAPI from "../../../api/clienteAxios";
import Boton from "../../../componentes/Boton";
import Paginacion from "../../../componentes/Paginacion";
import type Genero from "../../generos/modelos/Genero.model";
import type Pelicula from "../modelos/pelicula.model";
import ListadoPeliculas from "./ListadoPeliculas";

export default function FiltrarPeliculas() {

    const valorInicial: FormType = {
        titulo: '',
        generoId: 0,
        proximosEstrenos: false,
        enCines: false
    };

    const { register, handleSubmit, reset } = useForm<FormType>({
        defaultValues: valorInicial
    });

    const [generos, setGeneros] = useState<Genero[]>([]);
    const [peliculas, setPeliculas] = useState<Pelicula[]>();
    const [cantidadTotalRegistros, setCantidadTotalRegistros] = useState(0);
    const [pagina, setPagina] = useState(1);
    const [recordsPorPagina, setRecordsPorPagina] = useState(5);

    // Último filtro ENVIADO (no lo que se está escribiendo): al cambiar de página se conserva.
    const [filtro, setFiltro] = useState<FormType>(valorInicial);

    useEffect(() => {
        clienteAPI.get<Genero[]>('/generos/todos')
            .then(res => setGeneros(res.data))
            .catch(() => setGeneros([]));
    }, []);

    useEffect(() => {
        let cancelado = false;
        setPeliculas(undefined);

        clienteAPI.get<Pelicula[]>('/peliculas/filtrar', {
            params: { ...filtro, pagina, recordsPorPagina }
        }).then(res => {
            if (cancelado) return;
            const total = parseInt(res.headers['cantidad-total-registros']);
            setCantidadTotalRegistros(Number.isNaN(total) ? 0 : total);
            setPeliculas(res.data);
        }).catch(() => {
            if (cancelado) return;
            setCantidadTotalRegistros(0);
            setPeliculas([]);
        });

        return () => { cancelado = true; };
    }, [filtro, pagina, recordsPorPagina]);

    const onSubmit: SubmitHandler<FormType> = (data) => {
        // El <select> entrega el id como texto: se convierte a número.
        setFiltro({ ...data, generoId: Number(data.generoId) });
        setPagina(1);
    }

    const limpiar = () => {
        reset(valorInicial);
        setFiltro(valorInicial);
        setPagina(1);
    }

    return (
        <>
            <h3>Filtro de Películas</h3>
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="row row-cols-lg-auto g-3 align-items-center">
                <div className="col-12">
                    <input id="titulo" placeholder="Título de la película" autoComplete="off"
                        className="form-control" {...register('titulo')} />
                </div>
                <div className="col-12">
                    <select className="form-select" {...register('generoId')}>
                        <option value="0">--Seleccione un género--</option>
                        {generos.map(genero => <option key={genero.id} value={genero.id}>{genero.nombre}</option>)}
                    </select>
                </div>
                <div className="col-12">
                    <div className="form-check">
                        <input type="checkbox" className="form-check-input" id="proximosEstrenos"
                            {...register('proximosEstrenos')} />
                        <label htmlFor="proximosEstrenos">Próximos Estrenos</label>
                    </div>
                </div>
                <div className="col-12">
                    <div className="form-check">
                        <input type="checkbox" className="form-check-input" id="enCines"
                            {...register('enCines')} />
                        <label htmlFor="enCines">En Cines</label>
                    </div>
                </div>
                <div className="col-12">
                    <Boton type="submit">Filtrar</Boton>
                    <Boton onClick={limpiar} className="btn btn-danger ms-2">Limpiar</Boton>
                </div>
            </form>

            <div className="mt-4">
                <ListadoPeliculas peliculas={peliculas} />
            </div>

            {cantidadTotalRegistros > 0 && <Paginacion
                paginaActual={pagina}
                registrosPorPagina={recordsPorPagina}
                cantidadTotalRegistros={cantidadTotalRegistros}
                registrosPorPaginaOpciones={[5, 10, 25, 50]}
                onCambioPaginacion={(nuevaPagina, nuevosRegistros) => {
                    setPagina(nuevaPagina);
                    setRecordsPorPagina(nuevosRegistros);
                }}
            />}
        </>
    );
}

interface FormType {
    titulo: string;
    generoId: number;
    proximosEstrenos: boolean;
    enCines: boolean;
}
