import {BrowserRouter, Route, Routes} from "react-router-dom"
import Repositorio from "./Pages/Repositorio/Index"
import Main from "./Pages/Main/Index"

export default function Rotas(){
    return(
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Main/>}/>
                <Route path="/repositorio/:repositorio" element={<Repositorio/>}/>
            </Routes>
        </BrowserRouter>
    )
}