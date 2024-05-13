import { useEffect, useState } from "react";
import { Button, Card, Col, Container, ListGroup, ListGroupItem, Row } from "react-bootstrap";
import { Item } from "../../types/Item.type";
import { useNavigate, useParams } from "react-router-dom";

const ItemDetail = () => {
    const navigate = useNavigate();
    const [item, setItem] = useState({} as Item)
    const {itemCode} = useParams();

    useEffect(() =>{
        const fetchItem = async () => {
            try{
                const response = await fetch(`http://localhost:8080/api/items/${itemCode}`);
                const data = await response.json();
    
                setItem(data);
            } catch(error){
                console.error(error);
            }
        }

        fetchItem();
    }, [itemCode]);
    
    const handleButtonUpdate = (itemCode: any) => {
    
        navigate(`/item/${itemCode}/update`);
    };

    const handleDiscount = () => {
        if (item.reductionsDTO && item.reductionsDTO.length > 0) {
            const totalReduction = item.reductionsDTO.reduce((total, reduction) => {
              return total + (item.price * reduction.reducedPrice);
            }, 0);
            return item.price - totalReduction;
          }
          return item.price;
    }

return(
    <>
    <Container className="my-5">
        <Row>
            <Col>
                <h1>Item Detail</h1>
            </Col>
        </Row>
        <Row>
            <Col>
                <Card>
                    <Card.Body>
                        <Card.Title>Item</Card.Title>
                        <ListGroup variant="flush">
                            <ListGroupItem>Item Code: {item.itemCode}</ListGroupItem>
                            <ListGroupItem>Description: {item.description}</ListGroupItem>
                            <ListGroupItem>Price: {item.price}</ListGroupItem>
                            <ListGroupItem>{item.reductionsDTO && item.reductionsDTO.length > 0 ? ("Reduced price: " + handleDiscount()) : ("No reductions")}</ListGroupItem>
                            <ListGroupItem>State: {item.itemStateEnum}</ListGroupItem>
                        </ListGroup>
                    </Card.Body>
                </Card>
            </Col>
        </Row>
        <Row className="mt-4">
            <Col>
                <Card>
                    <Card.Body>
                        <Card.Title>User</Card.Title>
                        {item.userDTO ? (
                            <ListGroup variant="flush">
                                <ListGroupItem>Name: {item.userDTO.name}</ListGroupItem>
                                <ListGroupItem>Email: {item.userDTO.email}</ListGroupItem>
                            </ListGroup>
                        ) : (
                            <p>User information not available</p>
                        )}
                    </Card.Body>
                </Card>
            </Col>
        </Row>
        <Row className="mt-4">
            <Col>
                <Card>
                    <Card.Body>
                        <Card.Title>Suppliers</Card.Title>
                        {item.suppliersDTO && item.suppliersDTO.length > 0 ? (
                            <ListGroup variant="flush">
                                {item.suppliersDTO.sort((a, b) => a.supplierCode - b.supplierCode).map((supplier) => (
                                    <ListGroupItem key={supplier.supplierCode}>
                                        <h5>Supplier Code: {supplier.supplierCode}</h5>
                                        <p>Name: {supplier.name}</p>
                                        <p>Country: {supplier.country}</p>
                                    </ListGroupItem>
                                ))}
                            </ListGroup>
                        ) : (
                            <p>No suppliers available</p>
                        )}
                    </Card.Body>
                </Card>
            </Col>
        </Row>
        <Row className="mt-4">
            <Col>
                <Card>
                    <Card.Body>
                        <Card.Title>Reductions</Card.Title>
                        {item.reductionsDTO && item.reductionsDTO.length > 0 ? (
                            <ListGroup variant="flush">
                                {item.reductionsDTO.sort((a, b) => a.reductionCode - b.reductionCode).map((reduction) => (
                                    <ListGroupItem key={reduction.reductionCode}>
                                        <h5>Reduction Code: {reduction.reductionCode}</h5>
                                        <p>Reduced Price: {reduction.reducedPrice * 100}%</p>
                                        <p>Start Date: {new Date(reduction.startDate).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' })}</p>
                                        <p>End Date: {new Date(reduction.endDate).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' })}</p>
                                    </ListGroupItem>
                                ))}
                            </ListGroup>
                        ) : (
                            <p>No reductions available</p>
                        )}
                    </Card.Body>
                </Card>
            </Col>
        </Row>
        <Row className="mt-4">
            <Col className="text-end">
                <Button onClick={() => handleButtonUpdate(itemCode)}>Update</Button>
            </Col>
        </Row>
    </Container>
    </>
)
} 

export default ItemDetail;