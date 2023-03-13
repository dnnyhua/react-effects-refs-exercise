import { useState, useEffect, useRef } from "react";
import Card from "./Card";
import axios from "axios";
import './DrawCard.css'

// https://deckofcardsapi.com/api/deck/<<deck_id>>/draw/

const baseUrl = "https://deckofcardsapi.com/api/deck"



const DrawCard = () => {

    const [deck, setDeck] = useState(null);
    const [cardPile, setCardPile] = useState([]);

    // states for auto draw
    const [autoDraw, setAutoDraw] = useState(false);
    const timerRef = useRef(null)
    let deck_id =


        // Get a deck data and update deck state
        useEffect(() => {
            async function getDeckData() {
                const res = await axios.get(`${baseUrl}/new/shuffle/`);
                console.log(res.data)
                setDeck(res.data)
            }
            getDeckData();
        }, [setDeck])


    // draw one card at a time
    async function getCard() {
        deck_id = deck["deck_id"]
        try {
            let res = await axios.get(`${baseUrl}/${deck_id}/draw/`);

            // console.log(res)
            const card = res.data.cards[0]
            // console.log(card.image)

            if (res.data.remaining === 0) {
                setAutoDraw(false);
                throw new Error("There are no cards left to draw")
            }

            setCardPile(cardPile => [...cardPile,
            {
                id: card.code,
                image: card.image
            }
            ]);
        } catch (err) {
            alert(err)
        }
    }

    useEffect(() => {
        if (autoDraw && !timerRef.current) {
            timerRef.current = setInterval(async () => {
                await getCard();
            }, 1000)
        }

        // useEffect cleanup
        return () => {
            clearInterval(timerRef.current);
            timerRef.current = null;
        }
    }, [autoDraw, setAutoDraw, deck]);

    // Toggle auto draw on and off
    const toggleAutoDraw = () => {
        setAutoDraw(autodraw => !autodraw)
    };

    const cards = cardPile.map(c => (<Card key={c.id} image={c.image} />))

    return (
        <div className="DrawCard">
            <button className="DrawCard-Btn" onClick={getCard}>Draw a card</button>

            {/* if clicked on it should say Stop Auto Draw */}
            <button className="DrawCard-Btn" onClick={toggleAutoDraw}>
                {autoDraw ? "Stop Auto" : "Start Auto"}
            </button>

            <div className="DrawCard-cardArea">{cards}</div>
        </div>
    )
}

export default DrawCard
