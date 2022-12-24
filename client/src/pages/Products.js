
import { useEffect } from "react"
import { Link } from "react-router-dom"



export default function Products({ products, setSelected, addCommande }) {


  const select = (product)=>{
    setSelected(product)
  }

  return (
    <div className="content">
      <h3>Sneackers</h3>
      <div className="products">
        {products.map((product, key) => product.categorie === "sneacker" ? (
          <div className='card p-2' key={key}>
            <Link to={`/products/${key}`}>
              <img onClick={()=>select(product)} style={{ width: 250, height: 250 }} src={`data:image/${product.image.img.contentType};base64,${product.image.img.data.toString('base64')}`} alt="product" />
            </Link>
            <div className="d-flex justify-content-between">
              <span>{product.name}</span>

              <button onClick={()=> addCommande(product)} className="btn btn-light mt-1"><i className="bi bi-cart-plus"></i></button >
              <span  style={{ textDecoration: 'none' }}>{product.price}$</span>
            </div>
          </div>
        ) : null)}
      </div>
      <h3>Hats</h3>
      <div className="products ">
        {products.map((product, key) => product.categorie === "hat" ? (
          <div className='card p-2' key={key}>
            <Link to={`/products/${key}`}>
              <img onClick={()=>select(product)} style={{ width: 250, height: 250 }} src={`data:image/${product.image.img.contentType};base64,${product.image.img.data.toString('base64')}`} alt="product" />
            </Link>
            <div className="d-flex justify-content-between">
              <span>{product.name}</span>
              <button onClick={()=>addCommande(product)} className="btn btn-light mt-1"><i className="bi bi-cart-plus"></i></button >

              <span style={{ textDecoration: 'none' }}>{product.price}$</span>
            </div>
          </div>
        ) : null)}
      </div>
      <h3>Jackets</h3>
      <div className="products ">
        {products.map((product, key) => product.categorie === "jacket" ? (
          <div className='card p-2' key={key}>
            <Link to={`/products/${key}`}>
              <img onClick={()=>select(product)} style={{ width: 250, height: 250 }} src={`data:image/${product.image.img.contentType};base64,${product.image.img.data.toString('base64')}`} alt="product" />
            </Link>
            <div className="d-flex justify-content-between">
              <span>{product.name}</span>
              <button onClick={()=>addCommande(product)} className="btn btn-light mt-1"><i className="bi bi-cart-plus"></i></button >

              <span style={{ textDecoration: 'none' }}>{product.price}$</span>
            </div>
          </div>
        ) : null)}
      </div>
    </div>
  )
}
