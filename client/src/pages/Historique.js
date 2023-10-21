import axios from "axios";
import { useEffect, useState } from "react";
import { Route } from "react-router-dom";

// nested routes
import Offers from "./Offers";
import baseUrl from "../baseUrl";

export default function Historique({ orders, refresh, clientName, setOrders }) {
  const deleteFront = (id) => {
    const newArr = [...orders].filter((el) => el._id !== id);
    setOrders(newArr);
    return;
  };

  const deleteCommande = async (commandeId, all) => {
    try {
      const answer = await axios.post(
        baseUrl + "/orders/delete",
        {
          clientName,
          commandeId,
          all,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `debut ${localStorage.getItem("accessToken")}`,
          },
        }
      );
      if (answer.status !== 201) {
        refresh();
        deleteCommande();
      }
      refresh();
      setTimeout(() => alert("successfully deleted"), 1000);
    } catch (error) {
      refresh();
    }
  };
  //   window.location.reload()

  return (
    <>
      <div className="content" style={{ height: 500, overflow: "scroll" }}>
        <div
          className="px-3 w-100 bg-secondary d-flex justify-content-between align-items-center rounded text-light"
          style={{ height: 50 }}
        >
          <strong>nom</strong>
          <strong>prix</strong>
          <strong>quantité</strong>
          <strong>total</strong>
          <h4>
            <i className="bi bi-gear-wide"></i>
          </h4>
        </div>
        {orders ? (
          orders.map((order, index) => (
            <>
              <div
                key={index}
                className=" bg-light d-flex justify-content-between px-3 align-items-center  mt-2"
                style={{ height: 80, borderRadius: "20px", width: "100%" }}
              >
                {/* <img className='image-rounded me-3' style={{ borderRadius: '50%', cursor: "pointer" }} width={70} src={""} alt="" /> */}
                <h6 className="nom " style={{ width: 100 }}>
                  {order.product_name}
                </h6>
                <h4 className="status">{order.product_price}$</h4>

                <h4 className="status">
                  <span>{order.number}</span>
                </h4>

                <h4>{order.number * order.product_price}$</h4>
                <h4
                  onClick={() => {
                    deleteCommande(order._id, false);
                  }}
                  style={{ cursor: "pointer" }}
                >
                  <i className="bi bi-x-lg"></i>
                </h4>
              </div>
              <div
                className="bg-light text-center text-secondary rounded"
                style={{ width: "14%" }}
              >
                {order.date}
              </div>
            </>
          ))
        ) : (
          <strong>veuillez vous connecter </strong>
        )}
      </div>
      <div className="content"></div>
    </>
  );
}
