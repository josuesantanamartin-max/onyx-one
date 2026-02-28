import { driver } from "driver.js";
import "driver.js/dist/driver.css";

export const startDashboardTour = () => {
    const driverObj = driver({
        showProgress: true,
        animate: true,
        doneBtnText: "¡Listo!",
        nextBtnText: "Siguiente",
        prevBtnText: "Anterior",
        allowClose: true,
        steps: [
            {
                element: '#header-title',
                popover: {
                    title: 'Bienvenido a Aliseus',
                    description: 'Este es tu centro de control financiero y personal totalmente privado.'
                }
            },
            {
                element: '#widget-filters',
                popover: {
                    title: 'Filtra tu Vista',
                    description: 'Cambia entre widgets de Finanzas, Vida o ver Todos. Organiza tu dashboard como prefieras.'
                }
            },
            {
                element: '#edit-mode-btn',
                popover: {
                    title: 'Personaliza Todo',
                    description: 'Activa el modo edición para mover, redimensionar o añadir nuevos widgets.'
                }
            },
            {
                element: '#smart-insight-widget',
                popover: {
                    title: 'Insights Inteligentes',
                    description: 'Aquí verás resúmenes automáticos y alertas sobre tu estado financiero y personal.'
                }
            },
            {
                element: '#theme-toggle',
                popover: {
                    title: 'Modo Oscuro',
                    description: 'Alterna entre modo claro y oscuro según tu preferencia.'
                }
            }
        ]
    });

    driverObj.drive();
};
