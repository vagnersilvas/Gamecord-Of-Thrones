import { Box, Text, TextField, Image, Button } from '@skynexui/components';
import React from 'react';
import appConfig from '../config.json';
import { createClient } from '@supabase/supabase-js';
import { useRouter } from 'next/router';
import { ButtonSendSticker } from '../src/components/ButtonSendSticker'



const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTY0MzMyODI1OSwiZXhwIjoxOTU4OTA0MjU5fQ.EwOuib0rjSG5tF9mZ9PQ9s4oCfx9WVvDaiJ75Gzdcqc';
const SUPABASE_URL = 'https://qzlpfyfgzdvbsxohspdw.supabase.co';
const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);


const GIT_HUB_API = 'https://api.github.com';

async function apiUrl(user) {
    const api = await fetch(`${GIT_HUB_API}/users/${user}`);
    const json = await api.json();

    return json;
}


function escutaMensagemEmTempoReal(adicionaMensagens) {
    return supabaseClient
        .from('messages')
        .on('INSERT', (respostaLive) => {
            // console.log(respostaLive.new)
            adicionaMensagens(respostaLive.new)
        })
        .subscribe();
}
// fetch(`${SUPABASE_URL}/rest/v1/messages?select+*`, {
//     headers: {
//         'Content-Type': 'application/json',
//         'apikey': SUPABASE_ANON_KEY,
//         'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
//     }
// })
//     .then((res) => {
//         return res.json()
//     })
//     .then((response) => {
// console.log(response);
//     })

export default function ChatPage() {
    const roteamento = useRouter();
    const usuarioLogado = roteamento.query.username;

    // console.log('usuario logado', usuarioLogado);

    const [message, setMessage] = React.useState('');
    const [messageList, setMessageList] = React.useState([]);
    const [carregando, setCarregando] = React.useState(true);

    React.useEffect(() => {
        supabaseClient
            .from('messages')
            .select('*')
            .order('id', { ascending: false })
            .then(({ data }) => {
                setMessageList(data);
                setCarregando(false);
            });

        escutaMensagemEmTempoReal((newMessage) => {
            setMessageList((currentValue) => {
                return [
                    newMessage,
                    ...currentValue
                ]
            })

        });
    }, []);

    function handleNewMessage(newMessage) {
        const mensagem = {
            de: usuarioLogado,
            texto: newMessage,
        }

        supabaseClient
            .from('messages')
            .insert([
                mensagem
            ])
            .then(({ data }) => {

            })

        setMessageList([
            mensagem,
            ...messageList,
        ])
        setMessage('')
    }


    return (
        <Box
            styleSheet={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                backgroundColor: appConfig.theme.colors.primary[500],
                backgroundImage: `url(https://www.themoviedb.org/t/p/original/suopoADq0k8YZr4dQXcU6pToj6s.jpg)`,
                backgroundRepeat: 'no-repeat', backgroundSize: 'cover', backgroundBlendMode: 'multiply',
                color: appConfig.theme.colors.neutrals['600']
            }}
        >
            <Box
                styleSheet={{
                    display: 'flex',
                    flexDirection: 'column',
                    flex: 1,
                    boxShadow: '0 2px 10px 0 rgb(0 0 0 / 20%)',
                    borderRadius: '5px',
                    backgroundColor: appConfig.theme.colors.neutrals[700],
                    height: '100%',
                    maxWidth: '95%',
                    maxHeight: '95vh',
                    padding: '32px',
                }}
            >
                <Header />
                <Box
                    styleSheet={{
                        position: 'relative',
                        display: 'flex',
                        flex: 1,
                        height: '80%',
                        backgroundColor: appConfig.theme.colors.neutrals[600],
                        flexDirection: 'column',
                        borderRadius: '5px',
                        padding: '16px',
                    }}
                >

                    <MessageList messages={messageList} carregando={carregando} />

                    <Box
                        as="form"
                        styleSheet={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between'
                        }}
                    >
                        <ButtonSendSticker
                            onStickerClick={(sticker) => {
                                handleNewMessage(`:sticker: ${sticker}`)
                            }} />

                        <TextField
                            value={message}
                            onChange={(event) => {
                                const valor = event.target.value;
                                setMessage(valor);
                            }}
                            onKeyPress={(event) => {
                                if (event.key === 'Enter') {
                                    event.preventDefault();
                                    handleNewMessage(message);
                                }
                            }}
                            placeholder="Insira sua mensagem aqui..."
                            type="textarea"
                            styleSheet={{
                                width: '100%',
                                border: '0',
                                resize: 'none',
                                borderRadius: '5px',
                                padding: '6px 8px',
                                backgroundColor: appConfig.theme.colors.neutrals[800],
                                marginRight: '12px',
                                color: appConfig.theme.colors.neutrals[200],
                            }}
                        />


                        <Box>
                            <Button
                                colorVariant='negative'
                                label='ENVIAR'
                                onClick={() => {
                                    handleNewMessage(message);
                                }}
                                styleSheet={{
                                    backgroundColor: appConfig.theme.colors.neutrals[200],
                                    width: '100px',
                                    height: '40px',
                                    borderRadius: '10px',
                                    display: 'inline-block',
                                    textAlign: 'center',
                                    padding: '2px',
                                    marginRight: '8px',
                                    marginBottom: '10px',
                                    color: appConfig.theme.colors.neutrals[600]
                                }}
                            />
                        </Box>
                    </Box>
                </Box>
            </Box>
        </Box>
    )
}

function Header() {
    return (
        <>
            <Box styleSheet={{ width: '100%', marginBottom: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }} >
                <Text variant='heading5'>
                    Chat
                </Text>
                <Button
                    variant='tertiary'
                    colorVariant='neutral'
                    label='Logout'
                    href="/"
                />
            </Box>
        </>
    )
}

function MessageList(props) {
    
    
    
    return (
        <Box
            tag="ul"
            styleSheet={{
                overflow: 'hidden',
                overflowY: 'scroll',
                display: 'flex',
                flexDirection: 'column-reverse',
                flex: 1,
                color: appConfig.theme.colors.neutrals["000"],
                marginBottom: '16px',
            }}
        >
            {props.carregando && (
                <Box
                    styleSheet={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)'
                    }}
                >
                    <Text styleSheet={{ color: '#9AA5B1', fontSize: { xs: '13px', 'md': '14px' } }}>
                        Carregando mensagens...
                    </Text>
                </Box>
            )}
            {props.messages.map((message) => {
                return (
                    <Text
                        key={message.id}
                        tag="li"
                        styleSheet={{
                            borderRadius: '5px',
                            padding: '6px',
                            marginBottom: '12px',
                            hover: {
                                backgroundColor: appConfig.theme.colors.neutrals[700],
                            }
                        }}
                    >
                        <Box
                            styleSheet={{
                                marginBottom: '8px',
                            }}
                        >
                            <Image
                                onMouseOver={async () => {
                                    const user = await apiUrl(message.de);
                                    const { name, following, followers } = user
                                    return (
                                        <>
                                            {name}
                                        </>
                                    )
                                }}
                                styleSheet={{
                                    width: '20px',
                                    height: '20px',
                                    borderRadius: '50%',
                                    display: 'inline-block',
                                    marginRight: '8px',
                                }}
                                src={`https://github.com/${message.de}.png`}
                            />
                            <Text tag="strong">
                                {message.de}
                            </Text>
                            <Text
                                styleSheet={{
                                    fontSize: '10px',
                                    marginLeft: '8px',
                                    color: appConfig.theme.colors.neutrals[300],
                                }}
                                tag="span"
                            >
                                {(new Date().toLocaleDateString())}
                            </Text>
                        </Box>
                        {message.texto.startsWith(':sticker:')
                            ? (
                                <Image
                                    src={message.texto.replace(':sticker:', '')}
                                    styleSheet={{
                                        width: '100px',
                                    }}
                                />
                            )
                            : message.texto
                        }


                        {/* {message.texto} */}
                    </Text>
                )
            })}

        </Box>
    )
}