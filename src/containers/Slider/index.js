import { useEffect, useState } from "react";
import { useData } from "../../contexts/DataContext";
import { getMonth } from "../../helpers/Date";

import "./style.scss";

const Slider = () => {
  const { data } = useData();
  const [index, setIndex] = useState(0);

  // Trier les événements par date décroissante (les plus récents en premier)
  const byDateDesc = data?.focus
    ?.slice()
    ?.sort((evtA, evtB) => new Date(evtB.date) - new Date(evtA.date)) || [];

  // Gestion automatique du défilement
  useEffect(() => {
    if (byDateDesc.length > 0) {
      const timeout = setTimeout(() => {
        setIndex((prevIndex) => (prevIndex + 1) % byDateDesc.length); // Boucle parfaite
      }, 5000); // Toutes les 5 secondes

      return () => clearTimeout(timeout); // Nettoyage pour éviter des conflits
    }
    return undefined; // Ajout explicite pour consistent-return
  }, [index, byDateDesc.length]); // Relance lorsque l'index ou la longueur des données change

  // Si aucune donnée, affiche un contenu vide
  if (byDateDesc.length === 0) {
    return <div className="SlideCardList">Aucun événement disponible.</div>;
  }

  // Rendu du composant
  return (
    <div className="SlideCardList">
      {byDateDesc.map((event, idx) => (
        <div
          key={event.title}
          className={`SlideCard SlideCard--${
            index === idx ? "display" : "hide"
          }`}
        >
          <img src={event.cover} alt={event.title} />
          <div className="SlideCard__descriptionContainer">
            <div className="SlideCard__description">
              <h3>{event.title}</h3>
              <p>{event.description}</p>
              <div>{getMonth(new Date(event.date))}</div>
            </div>
          </div>
        </div>
      ))}

      <div className="SlideCard__paginationContainer">
        <div className="SlideCard__pagination">
          {byDateDesc.map((bulletEvent, bulletIdx) => (
            <input
              key={`bullet-${bulletEvent.id || bulletIdx}`} 
              type="radio"
              name="radio-button"
              checked={index === bulletIdx}
              onChange={() => setIndex(bulletIdx)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Slider;
