import IProduct from "../untils/IProduct";
import style from "../css/layout.module.css"
import ProductItem from "./ProductItem";

export default function ProductList(
    { products }: {products: IProduct[]}) {
    return (
        <div className={style.product_list}>
            {products.map((product)=>(
                <ProductItem product={product}/>
            ))}
        </div>
    );
}
