import { useEffect, useState } from "react";
import { Route } from "react-router-dom";
import axios from "axios";

// nested routes
import Offers from "./Offers";
import baseUrl from "../baseUrl";

export default function Cart({
  commandes,
  deleteComande,
  incDec,
  clientName,
  refresh,
  status,
}) {
  const [tot, setTot] = useState(0);

  const [email, setEmail] = useState("");
  const [shipName, setShipName] = useState("");
  const [shipNPosition, setShipPosition] = useState("");
  const [shipPostcode, setShipPostcode] = useState("");
  const [shipRegion, setShipRegion] = useState("");
  const [shipPays, setShipPays] = useState("");

  const [billName, setBillName] = useState("");
  const [billNPosition, setBillPosition] = useState("");
  const [billPostcode, setBillPostcode] = useState("");
  const [billRegion, setBillRegion] = useState("");
  const [billPays, setBillPays] = useState("");

  const [card, setCard] = useState("");
  const [expDate, setExpDate] = useState("");
  const [cvv, setCvv] = useState("");

  const check =
    billName &&
    billNPosition &&
    billPostcode &&
    billRegion &&
    billPays &&
    shipName &&
    shipNPosition &&
    shipPostcode &&
    shipRegion &&
    shipPays &&
    cvv &&
    expDate &&
    card;

  const createOrder = () => {
    if (check) {
      if (!commandes.length) return alert("vous devez commander des articles");
      axios
        .post(
          baseUrl + "/orders/new",
          {
            clientName,
            commandes,
          },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `debut ${localStorage.getItem("accessToken")}`,
            },
          }
        )
        .then((response) => {
          if (response.status !== 201) {
            refresh();
            createOrder();
          } else {
            window.location.reload();
            return;
          }
        })
        .catch((err) => console.log("error retry again"));
    } else {
      alert("All field are required");
    }
  };

  useEffect(() => {
    let total = 0;
    for (let commade of commandes) {
      total += commade.qty * commade.product.price;
    }
    setTot(total);
  });

  return (
    <>
      <div className="content" style={{ height: 500, overflow: "scroll" }}>
        {commandes.length ? (
          commandes.map((commade, key) => (
            <div
              key={key}
              className=" bg-light d-flex justify-content-around align-items-center  mt-2"
              style={{ height: 80, borderRadius: "20px", width: "100%" }}
            >
              <div className="d-flex align-items-center">
                <img
                  className="image-rounded me-3"
                  style={{ borderRadius: "50%", cursor: "pointer" }}
                  width={70}
                  src={`data:image/${
                    commade.product.image.img.contentType
                  };base64,${commade.product.image.img.data.toString(
                    "base64"
                  )}`}
                  alt=""
                />
                <h6 className="nom " style={{ width: 100 }}>
                  {commade.product.name}
                </h6>
              </div>
              <div>
                <h4 className="status">
                  <i
                    onClick={() => incDec(commade, false)}
                    style={{ cursor: "pointer" }}
                    className="bi bi-chevron-left"
                  ></i>
                  <span>{commade.qty}</span>
                  <i
                    onClick={() => incDec(commade, true)}
                    style={{ cursor: "pointer" }}
                    className="bi bi-chevron-right"
                  ></i>
                </h4>
              </div>
              <h4 className="status">{commade.product.price * commade.qty}$</h4>

              <h4>
                <i
                  onClick={() => deleteComande(commade.product)}
                  style={{ cursor: "pointer" }}
                  className="bi bi-x-lg"
                ></i>
              </h4>
            </div>
          ))
        ) : (
          <h1>Votre Panier est vide...</h1>
        )}
        <Route path="/about/offers">
          <Offers />
        </Route>
      </div>
      <div className="d-flex justify-content-around mt-2">
        <h4>
          Total: <span className="text-success">{tot}$</span>
        </h4>
        {status ? (
          <button
            type="button"
            className="btn btn-primary"
            data-bs-toggle="modal"
            data-bs-target="#exampleModal2"
          >
            Finaliser
          </button>
        ) : (
          <button className="btn btn-primary" disabled>
            Finaliser(not connected)
          </button>
        )}
      </div>

      <div
        className="modal fade"
        id="exampleModal2"
        tabIndex={-1}
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div
          style={{ width: 350 }}
          className="modal-dialog modal-dialog-centered"
        >
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">
                Checkout
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <ul
                className="nav nav-tabs d-flex justify-content-center"
                id="myTab"
                role="tablist"
              >
                <div className="input-group mb-3 mt-3">
                  <span
                    className="input-group-text bi bi-envelope"
                    id="basic-addon1"
                  ></span>
                  <input
                    onChange={(e) => setEmail(e.target.value)}
                    value={email}
                    type="email"
                    className="form-control"
                    placeholder="Email"
                    aria-label="Username"
                    aria-describedby="basic-addon1"
                  />
                </div>

                <li className="nav-item" role="presentation">
                  <button
                    className="nav-link active"
                    id="home-tab"
                    data-bs-toggle="tab"
                    data-bs-target="#home-tab-pane"
                    type="button"
                    role="tab"
                    aria-controls="home-tab-pane"
                    aria-selected="true"
                  >
                    SHIPPING
                  </button>
                </li>
                <li className="nav-item" role="presentation">
                  <button
                    className="nav-link"
                    id="profile-tab"
                    data-bs-toggle="tab"
                    data-bs-target="#profile-tab-pane"
                    type="button"
                    role="tab"
                    aria-controls="profile-tab-pane"
                    aria-selected="false"
                  >
                    BILLING
                  </button>
                </li>
                <li className="nav-item" role="presentation">
                  <button
                    className="nav-link"
                    id="contact-tab"
                    data-bs-toggle="tab"
                    data-bs-target="#contact-tab-pane"
                    type="button"
                    role="tab"
                    aria-controls="contact-tab-pane"
                    aria-selected="false"
                  >
                    PAYMENT
                  </button>
                </li>
              </ul>
              <div className="tab-content" id="myTabContent">
                <div
                  className="tab-pane fade show active"
                  id="home-tab-pane"
                  role="tabpanel"
                  aria-labelledby="home-tab"
                  tabIndex={0}
                >
                  <form action="">
                    <div className="input-group mb-3 mt-3">
                      <span
                        className="input-group-text bi bi-person"
                        id="basic-addon1"
                      ></span>
                      <input
                        onChange={(e) => setShipName(e.target.value)}
                        value={shipName}
                        type="text"
                        className="form-control"
                        placeholder="Nom"
                        aria-label="Username"
                        aria-describedby="basic-addon1"
                      />
                    </div>

                    <div className="input-group mb-3 mt-3">
                      <span
                        className="input-group-text bi bi-geo-alt"
                        id="basic-addon1"
                      ></span>
                      <input
                        onChange={(e) => setShipPosition(e.target.value)}
                        value={shipNPosition}
                        type="text"
                        className="form-control"
                        placeholder="Position"
                        aria-describedby="basic-addon1"
                      />
                    </div>

                    <div className="input-group mb-3">
                      <input
                        onChange={(e) => setShipPostcode(e.target.value)}
                        value={shipPostcode}
                        type="number"
                        className="form-control"
                        placeholder="Postcode"
                        aria-label="Username"
                      />
                      <span className="input-group-text">@</span>
                      <input
                        onChange={(e) => setShipRegion(e.target.value)}
                        value={shipRegion}
                        type="text"
                        className="form-control"
                        placeholder="Region"
                        aria-label="Server"
                      />
                    </div>

                    <div className="input-group mb-3">
                      <label
                        className="input-group-text"
                        for="inputGroupSelect01"
                      >
                        Pays
                      </label>
                      <select
                        onChange={(e) => setShipPays(e.target.value)}
                        value={shipPays}
                        className="form-select"
                        id="inputGroupSelect01"
                      >
                        <option selected>choisissez votre pays</option>
                        <option value="1">Niger</option>
                        <option value="2">Mali</option>
                        <option value="3">Togo</option>
                      </select>
                    </div>
                  </form>
                </div>
                <div
                  className="tab-pane fade"
                  id="profile-tab-pane"
                  role="tabpanel"
                  aria-labelledby="profile-tab"
                  tabIndex={0}
                >
                  <form action="">
                    <div className="input-group mb-3 mt-3">
                      <span
                        className="input-group-text bi bi-person"
                        id="basic-addon1"
                      ></span>
                      <input
                        onChange={(e) => setBillName(e.target.value)}
                        value={billName}
                        type="text"
                        className="form-control"
                        placeholder="Name"
                        aria-label="Username"
                        aria-describedby="basic-addon1"
                      />
                    </div>

                    <div className="input-group mb-3 mt-3">
                      <span
                        className="input-group-text bi bi-geo-alt"
                        id="basic-addon1"
                      ></span>
                      <input
                        onChange={(e) => setBillPosition(e.target.value)}
                        value={billNPosition}
                        type="text"
                        className="form-control"
                        placeholder="Position"
                        aria-label="Username"
                        aria-describedby="basic-addon1"
                      />
                    </div>

                    <div className="input-group mb-3">
                      <input
                        onChange={(e) => setBillPostcode(e.target.value)}
                        value={billPostcode}
                        type="number"
                        className="form-control"
                        placeholder="Postcode"
                        aria-label="Username"
                      />
                      <span className="input-group-text">@</span>
                      <input
                        onChange={(e) => setBillRegion(e.target.value)}
                        value={billRegion}
                        type="text"
                        className="form-control"
                        placeholder="Region"
                        aria-label="Server"
                      />
                    </div>

                    <div className="input-group mb-3">
                      <label
                        className="input-group-text"
                        for="inputGroupSelect01"
                      >
                        Pays
                      </label>
                      <select
                        onChange={(e) => setBillPays(e.target.value)}
                        value={billPays}
                        className="form-select"
                        id="inputGroupSelect01"
                      >
                        <option selected>choisissez votre pays</option>
                        <option value="1">Niger</option>
                        <option value="2">Mali</option>
                        <option value="3">Togo</option>
                      </select>
                    </div>
                  </form>
                </div>
                <div
                  className="tab-pane fade"
                  id="contact-tab-pane"
                  role="tabpanel"
                  aria-labelledby="contact-tab"
                  tabIndex={0}
                >
                  <div className="input-group mb-3 mt-3">
                    <span
                      className="input-group-text bi bi-credit-card"
                      id="basic-addon1"
                    ></span>
                    <input
                      onChange={(e) => setCard(e.target.value)}
                      value={card}
                      type="number"
                      className="form-control"
                      placeholder="Card number"
                      aria-label="Username"
                      aria-describedby="basic-addon1"
                    />
                  </div>

                  <div className="input-group mb-3">
                    <span className="input-group-text  bi bi-calendar-event"></span>
                    <input
                      onChange={(e) => setExpDate(e.target.value)}
                      value={expDate}
                      type="text"
                      className="form-control"
                      placeholder="MM/YY"
                      aria-label="Username"
                    />
                    <span className="input-group-text bi bi-lock"></span>
                    <input
                      onChange={(e) => setCvv(e.target.value)}
                      value={cvv}
                      type="number"
                      className="form-control"
                      placeholder="CVV"
                      aria-label="Server"
                    />
                  </div>
                </div>
              </div>
            </div>
            <form className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Close
              </button>
              <button
                data-bs-dismiss="modal"
                type="submit"
                onClick={(e) => {
                  if (!commandes.lenght || !check) {
                    e.preventDefault();
                  }
                  createOrder();
                }}
                className="btn btn-primary"
              >
                Commander
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
