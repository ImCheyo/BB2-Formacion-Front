import { useEffect, useState } from "react";
import { Col, Container, Row, Table } from "react-bootstrap";
import { Item } from "../../types/Item.type";
import { useNavigate } from "react-router-dom";
import './Dashboard.css'

const Dashboard = () => {
    const navigate = useNavigate();

    const [items, setItems] = useState([] as Item[]);
    const [sortDirection, setSortDirection] = useState('desc');

    useEffect(() =>{
    const fetchItem = async () =>{
        try{
            const response = await fetch("http://localhost:8080/api/items");
            const data = await response.json();

            setItems(data);
        } catch(error){
            console.error(error);
        }
    }
    
    fetchItem();

}, []);

const handleRowClick = (itemCode: number) => {
    
    navigate(`/item/${itemCode}`);
};

const handleSort = () => {
    setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    setItems((prevItems) =>
        [...prevItems].sort((a, b) => {
            if (a.itemStateEnum < b.itemStateEnum) return sortDirection === 'asc' ? -1 : 1;
            if (a.itemStateEnum > b.itemStateEnum) return sortDirection === 'asc' ? 1 : -1;
            return 0;
        })
    );
}
    return (
        <>
        <Container className="mt-5">
            <Row>
                <Col>
                    <h1 className="text-center">Items</h1>
                    <Table bordered hover responsive>
                        <thead>
                            <tr>
                                <th>#Item Code</th>
                                <th>Description</th>
                                <th>Price</th>
                                <th onClick={handleSort} className="hover-state">
                                    State
                                </th>
                                <th>Creation Date</th>
                                <th>User</th>
                            </tr>
                        </thead>

                        <tbody>
                            {items.map((item) => (
                                <tr key={item.itemCode} onClick={() => handleRowClick(item.itemCode)} style={{ cursor: 'pointer' }}>
                                    <td>{item.itemCode}</td>
                                    <td>{item.description}</td>
                                    <td>{item.price}</td>
                                    <td>{item.itemStateEnum}</td>
                                    <td>{new Date(item.create_At).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' })}</td>
                                    <td>{item.userDTO.name}</td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </Col>
            </Row>
        </Container>    
        </>
    )
}

export default Dashboard;