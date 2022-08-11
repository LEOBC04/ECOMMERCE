import styled from 'styled-components'
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios'
import { setHeaders } from '../../Redux/slices/api';

const OrdenDetalle = () => {
    const params = useParams()

    const [order, setOrder] = useState({})
    const [loading, setLoading] = useState(false)

    console.log(order)

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                setLoading(true);
                const res = await axios.get(
                    `http://localhost:3001/orders/findOne/${params.id}`,
                    setHeaders()
                );

                setOrder(res.data)
                setLoading(false)
            } catch (error) {
                console.log(error)
            }
        }

        fetchOrder()
    }, [params.id])


    return(
        <StyleOrder>
            {loading ? (
                <p>Loading...</p>
                ) : (
                    <>
                        <OrdersContainer>
                            <h2>Order details</h2>
                            <p>
                                Delivery status:{" "}
                                {order.delivery_status === "pending" ? (
                                    <Pending>Pending</Pending>
                                ) : order.delivery_status === "dispatched" ? (
                                    <Dispatched>Dispatched</Dispatched>
                                ) : order.delivery_status === "delivered" ? (
                                    <Delivered>Delivered</Delivered>
                                ) : (
                                    "error"
                                )}
                            </p>

                            <h3>Ordered Books Id</h3>
                            <Items>
                                {order.products?.map((product, index) => (
                                    <Item key={index}>
                                        <span>{product._id}</span>
                                        <span>{product.cartQuantity}</span>
                                    </Item>
                                ))}
                            </Items>
                            <div>
                                <h3>Total price</h3>
                                <p>{"$" + (order.total_price / 100).toLocaleString()}</p>
                            </div>
                            <div>
                                <h3>User details</h3>
                                <p>Email: {" "}{order.user_email}</p>
                                <p>Username: {" "}{order.user_name}</p>
                                <p>Phone: {" "}{order.user_phone}</p>
                            </div>
                        </OrdersContainer>
                    </>
                )}
        </StyleOrder>
    )

}

export default OrdenDetalle

const StyleOrder = styled.div`
    margin: 3rem;
    display: flex;
    justify-content: center;
    h3 {
        margin: 1.5rem 0 0.5rem 0
    }
`

const OrdersContainer = styled.div`
    max-width: 500px;
    width: 100%;
    height: auto;
    box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;
    border-radius: 5px;
    padding: 2rem;
`

const Items = styled.div`
    span {
        margin-right: 1.5rem;
        &:first-child {
            font-weight: bold;
        }
    }
`

const Item = styled.li`
    margin-left: 0.5rem;
    margin-bottom: 0.5rem;
`

const Pending = styled.span`
    color: rgb(253, 181, 40);
    background: rgb(253, 181, 40, 0.12);
    padding: 3px 5px;
    border-radius: 3px;
    font-size: 14px;
`

const Dispatched = styled.span`
    color: rgb(38, 198, 249);
    background-color: rgb(38, 198, 249, 0.12);
    padding: 3px 5px;
    border-radius: 3px;
    font-size: 14px;
`

const Delivered = styled.span`
    color: rgb(38, 198, 249);
    background-color: rgb(102, 108, 255, 0.12);
    padding: 3px 5px;
    border-radius: 3px;
    font-size: 14px;
`