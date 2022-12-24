import { Route,  useRouteMatch } from "react-router-dom"

// nested routes
import Offers from "./Offers"

export default function ProductDetails({ product, addCommande }) {
  const { path } = useRouteMatch()

  return (
    <div className="content">
      <div className="product">
        <div className="image">
          <img src={`data:image/${product.image.img.contentType};base64,${product.image.img.data.toString('base64')}`} alt="" />
        </div>
        <div className="details">
          <div className="d-flex justify-content-between">
            <h2>{product.name}</h2>
            <h2>{product.price}$</h2>
          </div>
          <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Eos eaque repudiandae itaque dolorem nihil, voluptas corporis tempora provident optio harum modi inventore esse nostrum exercitationem magnam tempore odio laborum velit! Lorem ipsum dolor sit amet consectetur adipisicing elit.</p>
          <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Animi voluptate neque harum. Quam facere accusamus exercitationem in quidem mollitia eligendi porro eos voluptates iure incidunt, laudantium sed harum omnis quasi?</p>
          <div onClick={() =>addCommande(product) } className="btn btn-success">Ajouter au panier</div>
        </div>
      </div>

      <Route path={`${path}/offers`}>
        <Offers />
      </Route>
    </div>
  )
}
