import React, { useState, useEffect } from "react";
import "./styles.scss";

function useLocalStorage(key, defaultValue) {
  const [state, setState] = useState(
    () => window.localStorage.getItem(key) || defaultValue
  );

  useEffect(() => {
    window.localStorage.setItem(key, state);
  }, [key, state]);

  return [state, setState];
}

function CreateTicket({ idFirst, idSecond, onClickFirst, onClickSecond }) {
  return (
    <div className="snippet-window">
      <h2>Conteggio Tickets</h2>
      <p>
        <label htmlFor={idFirst}>Aggiungi il valore del tuo ticket</label>
        <input id={idFirst} type="number" onChange={onClickFirst} />
      </p>
      <p>
        <label htmlFor={idSecond}>Aggiungi la quantità di tickets</label>
        <input id={idSecond} type="number" onChange={onClickSecond} />
      </p>
    </div>
  );
}

function ItemValue({ value }) {
  return <span className="shopList__identify">{value}</span>;
}

function ItemList({ item, handlerChange, onDelete, onDone, tot }) {
  return (
    <li
      className={`shopList__item ${
        item.done ? " shopList__item--shopped" : ""
      }`}
    >
      <input className="shopList__identify" type="checkbox" onClick={onDone} />
      <ItemValue value={item.name} />
      <ItemValue value={item.amount} />
      {item.cost ? (
        <ItemValue value={item.cost} />
      ) : (
        <div className="shopList__input shopList__identify">
          <input type="number" onBlur={handlerChange} />
          <button type="button">ok</button>
        </div>
      )}
      <ItemValue value={tot} />
      <button className="shopList__identify" type="button" onClick={onDelete}>
        Delete
      </button>
    </li>
  );
}

export default function App() {
  const [tValue, setTValue] = useLocalStorage("ticketValue", 0);
  const [ticket, setTicket] = useLocalStorage("ticketAmount", 0);
  const [cost, setCost] = useState(0);
  const [amount, setAmount] = useState(1);

  const [list, setList] = useState([]);

  function handlerSubmitList(e) {
    e.preventDefault();
    const baseElements = e.target.elements;
    setList(
      list.concat({
        name: baseElements.name.value,
        id: Math.random(),
        amount: amount,
        cost: cost,
        tot: cost ? amount * cost : null
      })
    );
  }

  let total = list
    .filter(item => item.tot)
    .map(item => item.tot)
    .reduce((a, b) => a + b, 0);
  total = Number.isInteger(total) ? total : total.toFixed(2);
  const ticketS = Math.trunc(total / tValue);
  const ticketV = ticketS * tValue;

  return (
    <div className="App">
      <h1 style={{ display: "flex", alignItem: "center" }}>
        Lista spesa
        <span style={{ marginLeft: "5px" }}>
          Tickets {ticket} da {tValue} - valore{" "}
          {Number.isInteger(tValue * ticket)
            ? tValue * ticket
            : (tValue * ticket).toFixed(2)}
        </span>
        <button onClick={() => setTicket(0)} style={{ marginLeft: "auto" }}>
          Reset
        </button>
      </h1>
      <CreateTicket
        idFirst="ticketValue"
        idSecond="ticketAmount"
        onClickFirst={event => setTValue(event.target.value)}
        onClickSecond={event => setTicket(event.target.value)}
      />
      {/* altro modulo */}
      <div className="snippet-window">
        <h2>Lista Spesa</h2>
        <form onSubmit={handlerSubmitList}>
          Aggiungi prodotto:
          <ul>
            <li>
              <label htmlFor="name">Prodotto:</label>
              <input id="name" type="text" />
            </li>
            <li>
              <label htmlFor="amount">Quantità:</label>
              <input
                id="amount"
                type="number"
                onChange={event => setAmount(event.target.value)}
                value={amount}
              />
            </li>
            <li>
              <label htmlFor="cost">Prezzo:</label>
              <input
                id="cost"
                type="number"
                step="any"
                onChange={event => setCost(event.target.value)}
              />
            </li>
            <li>Totale: {cost * amount}</li>
          </ul>
          <button type="submit">imposta</button>
        </form>
      </div>
      {/* fine altro modulo */}
      <div className="snippet-window">
        <p className="summary">
          <span className="summary_item">totale spesa:{total}</span>
          <span className="summary_item">tickets da scambiare: {ticketS}</span>
          <span className="summary_item">valore tickets: {ticketV}</span>
          <span className="summary_item summary_item--wallet">
            totale buoni: {ticket}
          </span>
        </p>
        <p className="summary">
          <span className="summary_item">
            contanti:{(total - ticketV).toFixed(2)}
          </span>
          <span className="summary_item">
            ad altro buono: {tValue} - contanti
          </span>
          <span className="summary_item summary_item--wallet">
            totale buoni residui: {ticket - ticketS}
          </span>
        </p>
        <ul className="shopList">
          <li className="shopList__item">
            <ItemValue value="preso" />
            <ItemValue value="name" />
            <ItemValue value="quantità" />
            <ItemValue value="costo unitario" />
            <ItemValue value="costo totale" />
            <ItemValue value="elimina" />
          </li>
          {/* todo: creare funzione 'handlerChange' */}
          {/* todo: creare funzione 'handlerTotal' */}
          {list.map(item => {
            const tot = item.cost ? item.amount * item.cost : 0;
            return (
              <ItemList
                onDone={() =>
                  setList(
                    list.map(elClick => {
                      if (item !== elClick) return elClick;
                      return { ...item, done: !item.done };
                    })
                  )
                }
                onDelete={() =>
                  setList(list.filter(elClick => item !== elClick))
                }
                item={item}
                handlerChange={e => {
                  const newCost = e.target.value;
                  setList(
                    list.map(element => {
                      if (item !== element) return element;
                      return {
                        ...item,
                        cost: newCost,
                        tot: item.amount * newCost
                      };
                    })
                  );
                }}
                tot={tot}
                key={item.id}
              />
            );
          })}
        </ul>
      </div>
    </div>
  );
}
