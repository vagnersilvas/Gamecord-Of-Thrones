import { Box, TextField } from "@skynexui/components";
import appConfig from '../config.json'

export default function PaginaDoChat() {
    return (
        <>
        <TextField/>
            <Box
                styleSheet={{
                    // display: 'flex', alignItems: 'flex-end', justifyContent: 'flex-end',
                    backgroundColor: appConfig.theme.colors.primary[200],
                    backgroundImage: 'url(https://www.themoviedb.org/t/p/original/suopoADq0k8YZr4dQXcU6pToj6s.jpg)',
                    backgroundRepeat: 'no-repeat', backgroundSize: 'cover', backgroundBlendMode: 'multiply',
                }}

            />
        
            

        </>
    )
}

