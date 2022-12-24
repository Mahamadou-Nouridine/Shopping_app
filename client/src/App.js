import { BrowserRouter, Link, Route, Switch } from 'react-router-dom'

// pages
import Home from './pages/Home'
import Products from './pages/Products'
import ProductDetails from './pages/ProductDetails'
import { useEffect, useState } from 'react'
import axios from 'axios'
import Historique from './pages/Historique'
import Cart from './pages/Cart'
axios.defaults.withCredentials = true;
function App() {
  const [sign, setSign] = useState(true)
  const [client, setUser] = useState()
  const [selected, setSelected] = useState({})
  const [products, setProducts] = useState([])
  const [commandes, setCommandes] = useState([])
  const [name, setNmae] = useState("")
  const [inMail, setInMail] = useState("")
  const [upMail, setUpMail] = useState("")
  const [inPassword, setInPasswor] = useState("")
  const [upPassword, setUpPasswor] = useState("")
  const [confirm, setConfirm] = useState("")
  const [connexionStatus, setStatus] = useState(false)
  const [orders, setOrders] = useState(client ? client.order : [])




  // const instance = axios.create({
  //   baseURL: "http://localhost:3700/auth",
  //   timeout: 5000,
  //   headers: {'Content-Type': 'application/json'}
  // });

  const signUp = async () => {
    try {
      if (upMail && upPassword && name && confirm) {
        if(upPassword === confirm){
          const validation = await axios.post('http://localhost:3700/client',
          {
            password: upPassword,
            email: upMail,
            name: name
          },
          {
            headers: {
              "Content-Type": "application/json"
            }
          }
        )
        if(validation.status === 200){
          alert('User created successfully sign in for further operations')
        }
        setNmae('')
          setUpMail('')
          setUpPasswor('')
          setConfirm('')
          setSign(false)
        } else alert("passwords are not the same")
      } else {
        alert('please all field are required')
      }
    } catch (error) {
      if(error.response.status === 409) alert('User already exist')
      console.log(error);
    }
  }

  const singIn = async () => {
    try {
      const response = await axios.post('http://localhost:3700/auth', {
        "email": inMail,
        "password": inPassword,
      },
        {
          headers: {
            'Access-Control-Allow-Credentials': true
          }
        }
      )
      const data = await response.data;
      if (data) {
        setUser(data.client)
        localStorage.setItem('accessToken', data.accessTocken)
        setInMail('')
        setInPasswor('')
      }
    } catch (error) {
      if(error.response.status === 400) alert('email or password are incorrect')
      console.log(error);
    }
  }

  const refresh = async () => {
    try {
      const response = await axios.get('http://localhost:3700/auth/refresh')
      const data = await response.data;
      if (data) {
        setUser(data.client)
        localStorage.setItem('accessToken', data.accessToken)
      }
    } catch (error) {
      alert("votre session a expiré reconnectez vous")
    }
  }


  useEffect(() => {
    if (client) setStatus(true)
    else setStatus(false)
    if (client) setOrders(client.order)
  }, [client])


  useEffect(() => {
    refresh()

  }, [])

  useEffect(() => {
    axios.get('http://localhost:3700/products',
      {
        headers: { 'Content-Type': 'application/json' },
        data: {
          "email": inMail,
          "password": inPassword
        }
      })
      .then(response => response.data)
      .then(data => setProducts(data))
      .then(datat => () => console.log(datat))
  }, [])

  const addCommande = (product) => {
    const newArr = [...commandes]
    for (let i = 0; i < newArr.length; i++) {
      if (newArr[i].product.name === product.name) {
        return window.alert('commande existe deja')
      }
    }
    newArr.push({ product, qty: 1 });
    alert('Product Added')
    return setCommandes(newArr)
  }

  const deleteComande = (product) => {
    const newArr = [...commandes].filter(commande => commande.product !== product);
    setCommandes(newArr)
  }

  const incDec = (commande, toggle) => {
    let newArr = [...commandes]
    if (toggle) {
      newArr.forEach(com => {
        if (com === commande) {
          com.qty++;
        }
      })
      setCommandes(newArr)
    } else {
      newArr.forEach(com => {
        if (com === commande && com.qty > 0) {
          com.qty--;
          if (com.qty <= 0) {
            newArr = [...commandes].filter(comm => comm !== com)
          }
        }
      })
      setCommandes(newArr)
    }
  }

  const logout = async () => {
    try {
      const answer = await axios.get('http://localhost:3700/auth/logout',
        {
          headers: { "Content-Type": "application/json", 'Access-Control-Allow-Credentials': true }
        }
      );
      window.location.reload()
    } catch (error) {
      console.log(error)
    }

  }



  return (
    <div className="App">
      <BrowserRouter>
        <nav>
          <h1 onClick={() => refresh()}>Shopping App</h1>
          <Link to="/products">Products</Link>
          <Link to="/">Home</Link>
          <Link to="/Cart"><h4><i className="bi bi-cart4">
            <span style={{ fontSize: 10 }} className="position-absolute top-20 start-90 translate-middle badge rounded-pill bg-secondary">
              {commandes.length}
            </span>
          </i></h4>
          </Link>
          <Link to="/Historique">
            <h4><i className="bi bi-clock-history"></i></h4>
          </Link>
          <div className="ms-5 d-flex align-items-center justify-content-between">
            {!connexionStatus ? <button style={{ fontSize: 10 }} type="button" className="btn btn-primary me-3" data-bs-toggle="modal" data-bs-target="#exampleModal1">Login</button>
              : <button onClick={logout} style={{ fontSize: 10 }} className="btn btn-primary me-3">Logout</button>}
            <div className="d-flex flex-column ">
              <h1 className='text-center'>
                <i className="bi bi-person-circle"></i>
              </h1>
              {
                client ?
                  client.name : null
              }

            </div>
          </div>
        </nav>
        <Switch>
          <Route exact path="/" component={Home} />
          <Route path="/Cart">
            <Cart status={connexionStatus} clientName={client ? client.name : ""} refrech={refresh} incDec={incDec} deleteComande={deleteComande} commandes={commandes} />
          </Route>
          <Route path="/Historique">
            <Historique refresh={refresh} setOrders={(arr) => setOrders(arr)} clientName={client ? client.name : ""} products={products} orders={orders} />
          </Route>
          <Route path="/products/:id">
            <ProductDetails addCommande={addCommande} product={selected} />
          </Route>
          <Route path="/products">
            <Products deleteComande={deleteComande} addCommande={addCommande} setSelected={setSelected
            } products={products} />
          </Route>
        </Switch>
      </BrowserRouter>











      <div className="modal fade" id="exampleModal1" tabIndex={-1} aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">Modal title</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">




              <ul className="nav nav-tabs d-flex justify-content-center" id="myTab" role="tablist">

                <li className="nav-item" role="presentation">
                  <button onClick={() => setSign(true)} className="nav-link active" id="home-tab" data-bs-toggle="tab" data-bs-target="#login" type="button" role="tab" aria-controls="login" aria-selected="true">Sign in</button>
                </li>
                <li className="nav-item" role="presentation">
                  <button onClick={() => setSign(false)} className="nav-link" id="profile-tab" data-bs-toggle="tab" data-bs-target="#signUp" type="button" role="tab" aria-controls="signUp" aria-selected="false">Sign up</button>
                </li>

              </ul>
              <div className="tab-content" id="myTabContent">
                <div className="tab-pane fade show active" id="login" role="tabpanel" aria-labelledby="home-tab" tabIndex={0}>

                  <form onSubmit={(e) => {
                    e.preventDefault()
                  }} action="">

                    <div className="input-group mb-3 mt-3">
                      <span className="input-group-text bi bi-envelope" id="basic-addon1"></span>
                      <input value={inMail} onChange={(e) => setInMail(e.target.value)} type="email" className="form-control" placeholder="Email" aria-label="Username" aria-describedby="basic-addon1" />
                    </div>

                    <div value={inPassword} onChange={(e) => setInPasswor(e.target.value)} className="input-group mb-3 mt-3">
                      <span className="input-group-text bi bi-lock" id="basic-addon1"></span>
                      <input type="password" className="form-control" placeholder="Password" aria-label="Username" aria-describedby="basic-addon1" />
                    </div>
                    <button className='d-none' type='submit'></button>
                  </form>

                </div>
                <div className="tab-pane fade" id="signUp" role="tabpanel" aria-labelledby="profile-tab" tabIndex={0}>
                  <form onSubmit={(e) => {
                    e.preventDefault()

                  }} action="">

                    <div value={name} onChange={(e) => setNmae(e.target.value)} className="input-group mb-3 mt-3">
                      <span className="input-group-text bi bi-person" id="basic-addon1"></span>
                      <input type="text" className="form-control" placeholder="Nom" aria-label="Username" aria-describedby="basic-addon1" />
                    </div>

                    <div value={upMail} onChange={(e) => setUpMail(e.target.value)} className="input-group mb-3 mt-3">
                      <span className="input-group-text bi bi-envelope" id="basic-addon1"></span>
                      <input type="email" className="form-control" placeholder="Email" aria-label="Username" aria-describedby="basic-addon1" />
                    </div>

                    <div value={upPassword} onChange={(e) => setUpPasswor(e.target.value)} className="input-group mb-3 mt-3">
                      <span className="input-group-text bi bi-lock" id="basic-addon1"></span>
                      <input type="password" className="form-control" placeholder="Passwor" aria-label="Username" aria-describedby="basic-addon1" />
                    </div>

                    <div value={confirm} onChange={(e) => setConfirm(e.target.value)} className="input-group mb-3 mt-3">
                      <span className="input-group-text bi bi-lock" id="basic-addon1"></span>
                      <input type="password" className="form-control" placeholder="confirm Password" aria-label="Username" aria-describedby="basic-addon1" />
                    </div>

                    <button className='d-none' type='submit'></button>
                  </form>
                </div>
              </div>



            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
              <button onClick={sign ? () => singIn() : () => signUp()} type="button" className="btn btn-primary" data-bs-dismiss="modal">{sign ? "sign in" : "sign up"}</button>
            </div>
          </div>
        </div>
      </div>

    </div>
  )
}

export default App