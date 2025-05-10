import React, { useState, useEffect, useRef } from "react";

const UnityGame = ({ show, onClose }) => {
    const containerRef = useRef(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // Función para cargar y montar el juego
    const loadUnityGame = () => {
        if (isLoaded || isLoading) return;
        setIsLoading(true);

        // Añadir estilos para anular comportamientos que causan expansión
        const styleOverrides = document.createElement("style");
        styleOverrides.textContent = `
            #unity-container, #unity-canvas { 
                width: 100% !important;
                height: 100% !important;
                position: relative !important;
                margin: 0 !important;
                padding: 0 !important;
            }
            
            #unity-container.unity-desktop {
                left: auto !important;
                top: auto !important;
                transform: none !important;
                position: relative !important;
            }
            
            #unity-footer {
                position: absolute !important;
                bottom: 0 !important;
                width: 100% !important;
            }

            #unity-close-button {
                position: relative;
                float: right;
                width: 38px;
                height: 38px;
                background-color: rgba(83, 83, 83, 0.5);
                border-radius: 5px;
                cursor: pointer;
                margin-left: 10px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 24px;
                color: white;
                font-family: Arial, sans-serif;
            }
        `;
        document.head.appendChild(styleOverrides);

        // Crear el contenedor Unity con restricciones de tamaño
        const unityContainer = document.createElement("div");
        unityContainer.id = "unity-container";
        unityContainer.className = "unity-desktop";
        unityContainer.style.width = "100%";
        unityContainer.style.height = "100%";
        unityContainer.style.position = "relative";
        unityContainer.style.overflow = "hidden";

        // Crear el canvas de Unity con las dimensiones originales de 720p
        const unityCanvas = document.createElement("canvas");
        unityCanvas.id = "unity-canvas";
        unityCanvas.width = 1280;
        unityCanvas.height = 720;
        unityCanvas.tabIndex = -1;
        unityCanvas.style.width = "100%";
        unityCanvas.style.height = "100%";
        unityCanvas.style.display = "block"; // Evita espacio extra debajo del canvas

        // Crear barra de carga
        const loadingBar = document.createElement("div");
        loadingBar.id = "unity-loading-bar";
        loadingBar.style.width = "80%";
        loadingBar.style.maxWidth = "800px";
        loadingBar.style.margin = "0 auto";
        loadingBar.style.position = "absolute";
        loadingBar.style.top = "50%";
        loadingBar.style.left = "50%";
        loadingBar.style.transform = "translate(-50%, -50%)";
        
        const unityLogo = document.createElement("div");
        unityLogo.id = "unity-logo";
        loadingBar.appendChild(unityLogo);
        
        const progressBarEmpty = document.createElement("div");
        progressBarEmpty.id = "unity-progress-bar-empty";
        
        const progressBarFull = document.createElement("div");
        progressBarFull.id = "unity-progress-bar-full";
        progressBarEmpty.appendChild(progressBarFull);
        loadingBar.appendChild(progressBarEmpty);

        // Crear otros elementos de UI
        const unityWarning = document.createElement("div");
        unityWarning.id = "unity-warning";
        
        const unityFooter = document.createElement("div");
        unityFooter.id = "unity-footer";
        unityFooter.style.width = "100%";
        unityFooter.style.position = "absolute";
        unityFooter.style.bottom = "0";
        unityFooter.style.left = "0";
        
        const webglLogo = document.createElement("div");
        webglLogo.id = "unity-webgl-logo";
        unityFooter.appendChild(webglLogo);
        
        const fullscreenButton = document.createElement("div");
        fullscreenButton.id = "unity-fullscreen-button";
        unityFooter.appendChild(fullscreenButton);
        
        const buildTitle = document.createElement("div");
        buildTitle.id = "unity-build-title";
        buildTitle.textContent = "ProyectoFinalUdeC";
        unityFooter.appendChild(buildTitle);
        
        // Crear botón de cerrar personalizado e integrarlo en el footer de Unity
        const closeButton = document.createElement("div");
        closeButton.id = "unity-close-button";
        closeButton.title = "Cerrar juego";
        closeButton.innerHTML = "×";
        // Añadir evento click
        closeButton.addEventListener("click", () => {
            if (onClose) onClose();
        });
        unityFooter.appendChild(closeButton);

        // Añadir todo al contenedor
        unityContainer.appendChild(unityCanvas);
        unityContainer.appendChild(loadingBar);
        unityContainer.appendChild(unityWarning);
        unityContainer.appendChild(unityFooter);

        // Añadir el contenedor al DOM
        if (containerRef.current) {
            containerRef.current.innerHTML = "";
            containerRef.current.appendChild(unityContainer);

            // Definir la función para mensajes de alerta
            window.unityShowBanner = function(msg, type) {
                function updateBannerVisibility() {
                    unityWarning.style.display = unityWarning.children.length ? 'block' : 'none';
                }
                const div = document.createElement('div');
                div.innerHTML = msg;
                unityWarning.appendChild(div);
                if (type === 'error') div.style = 'background: red; padding: 0;';
                else {
                    if (type === 'warning') div.style = 'background: yellow; padding: 0;';
                    setTimeout(function() {
                        unityWarning.removeChild(div);
                        updateBannerVisibility();
                    }, 5000);
                }
                updateBannerVisibility();
            };

            // Cargar el script del loader de Unity
            const buildUrl = process.env.PUBLIC_URL + "/Build";
            const loaderUrl = buildUrl + "/GAME BUILD.loader.js";
            const script = document.createElement("script");
            script.src = loaderUrl;
            script.onload = () => {
                const config = {
                    dataUrl: buildUrl + "/GAME BUILD.data.unityweb",
                    frameworkUrl: buildUrl + "/GAME BUILD.framework.js.unityweb",
                    codeUrl: buildUrl + "/GAME BUILD.wasm.unityweb",
                    streamingAssetsUrl: process.env.PUBLIC_URL + "/StreamingAssets",
                    companyName: "DefaultCompany",
                    productName: "PoryectoFinalUdeC",
                    productVersion: "1.0",
                    showBanner: window.unityShowBanner,
                    devicePixelRatio: 1,
                    matchWebGLToCanvasSize: true  // Importante para que respete el tamaño del canvas
                };

                // Crear la instancia de Unity
                window.createUnityInstance(unityCanvas, config, (progress) => {
                    progressBarFull.style.width = 100 * progress + "%";
                }).then((unityInstance) => {
                    loadingBar.style.display = "none";
                    fullscreenButton.onclick = () => {
                        unityInstance.SetFullscreen(1);
                    };
                    window.unityInstance = unityInstance;
                    setIsLoaded(true);
                    setIsLoading(false);
                }).catch((message) => {
                    alert(message);
                    setIsLoading(false);
                });
            };

            document.body.appendChild(script);
        }
    };

    // Función para desmontar el juego
    const unmountUnityGame = () => {
        if (window.unityInstance) {
            window.unityInstance.Quit().then(() => {
                window.unityInstance = null;
                setIsLoaded(false);
            });
        }
        
        // Limpia el container
        if (containerRef.current) {
            containerRef.current.innerHTML = "";
        }

        // Remover estilos personalizados
        const styleElement = document.querySelector("style");
        if (styleElement && styleElement.textContent.includes("#unity-container")) {
            document.head.removeChild(styleElement);
        }
    };

    // Cargar el juego cuando el componente se monta si show es true
    useEffect(() => {
        // Importar los estilos necesarios
        const linkElement = document.createElement("link");
        linkElement.rel = "stylesheet";
        linkElement.href = process.env.PUBLIC_URL + "/TemplateData/style.css";
        document.head.appendChild(linkElement);

        return () => {
            // Limpiar al desmontar
            const existingLink = document.querySelector("link[href='" + process.env.PUBLIC_URL + "/TemplateData/style.css']");
            if (existingLink) {
                document.head.removeChild(existingLink);
            }
            unmountUnityGame();
        };
    }, []);

    // Cargar o desmontar el juego cuando cambia la prop show
    useEffect(() => {
        if (show) {
            loadUnityGame();
        } else {
            unmountUnityGame();
        }
    }, [show]);

    return (
        <div 
            className="unity-game-wrapper" 
            style={{ 
                display: show ? "block" : "none",
                width: "100%",
                maxWidth: "1280px",  // Ancho máximo del contenedor
                height: "720px",     // Altura fija 
                margin: "0 auto",    // Centrar horizontalmente
                position: "relative",
                overflow: "hidden"   // Evitar desbordamiento
            }}
        >
            <div 
                className="unity-container-wrapper" 
                ref={containerRef}
                style={{
                    width: "100%",
                    height: "100%",
                    position: "relative"
                }}
            ></div>
            {isLoading && <p className="loading-message">Cargando el juego...</p>}
        </div>
    );
};

export default UnityGame;