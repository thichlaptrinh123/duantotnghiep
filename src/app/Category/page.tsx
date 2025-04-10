import ProductList from "../components/ProductList";
export default function category(){
    let products = await getProductByIdCategory('http://localhost:3000/products',categoryId);
    
}