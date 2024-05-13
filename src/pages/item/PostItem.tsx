import { useEffect, useState } from 'react';
import './PostItem.css';
import { Button, Dropdown, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { Supplier } from '../../types/Supplier.type';
import { Reduction } from '../../types/Reduction.type';

const PostItem = () =>{
    
    const [suppliers, setSuppliers] = useState<Supplier[]>([]);
    const [selectedSuppliers, setSelectedSuppliers] = useState<Supplier[]>([]);
    const [reductions, setReductions] = useState<Reduction[]>([]);
    const [selectedReductions, setSelectedReductions] = useState<Reduction[]>([]);

    const navigate = useNavigate();

    useEffect(() => {
        getSuppliers();
        getReductions();
    }, []);

    const [formData, setFormData] = useState({
        description: "",
        price: "",
        suppliers: [] as Supplier[],
        reductions: [] as Reduction[],
        user: {}
    })

    const handleInputChange = (event: any) => {
        const {name, value} = event.target;
        setFormData({
            ...formData,
            [name]:value,
        })
    }

    useEffect(() => {
        setFormData({
            ...formData,
            suppliers: selectedSuppliers,
            reductions: selectedReductions,
        })
    }, [selectedSuppliers, selectedReductions]);

    const toggleSup = (option: Supplier) => {
        if (selectedSuppliers.some(supplier => supplier.supplierCode === option.supplierCode)){
            setSelectedSuppliers((oldSelected) => 
                oldSelected.filter((supplier) =>
                supplier.supplierCode !== option.supplierCode)
            );        
        } else {
            setSelectedSuppliers(
                [...selectedSuppliers, option]);
        }
    };

    const toggleRed = (option: any) => {
        if (selectedReductions.some(reduction => reduction.reductionCode === option.reductionCode)){
            setSelectedReductions((oldSelected) =>
                oldSelected.filter((reduction) =>
                reduction.reductionCode !== option.reductionCode)
            );
        } else {
            setSelectedReductions(
                [...selectedReductions, option]);
            }
    };

    const getSuppliers = async () => {
       try{
        const response = await fetch("http://localhost:8080/api/suppliers", {
            method: "GET",
        });

        const data = await response.json();
        setSuppliers(data);
       } catch(error){
        console.log(error);
       }
    };

    const getReductions = async () => {
        try{
         const response = await fetch("http://localhost:8080/api/reductions", {
             method: "GET",
         });
 
         const data = await response.json();
         setReductions(data);
        } catch(error){
         console.log(error);
        }
     };

    const handleSubmit = async (e: any) => {

        e.preventDefault();

        try{
            formData.user = { userCode: 1};

            console.log("formdata", formData);

            const response = await fetch("http://localhost:8080/api/items",{
                method : "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(formData)
            });

            const data = await response.json();
            navigate("/")
            console.log("Item created: ", data);
        }catch(error){
            console.error(error);
        }
    }

    return (
        <>
        <div className='center-form'>
            <h1>Create New Item</h1>
            <Form onSubmit={handleSubmit}>
                <Form.Group controlId="formBasicDescription">
                    <Form.Control
                        type="text"
                        name="description"
                        placeholder='Enter description'
                        value={formData.description}
                        onChange={handleInputChange}
                    />
                </Form.Group>

                <Form.Group controlId="formBasicPrice">
                    <Form.Control
                        type="number"
                        name="price"
                        placeholder='Enter price'
                        value={formData.price}
                        onChange={handleInputChange}
                    />
                </Form.Group>

                <Dropdown>
                    <Dropdown.Toggle variant="success" id="dropdown-basic">
                        Select Suppliers
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                        {suppliers.map((option, index) => (
                            <Dropdown.Item
                                key={index}
                                onClick={() => toggleSup(option)}
                                active={
                                    selectedSuppliers.includes(option)}
                            >
                                {option.name}
                            </Dropdown.Item>
                        ))}
                    </Dropdown.Menu>
                </Dropdown>

                <div> 
                    <strong>Selected Suppliers:</strong>  
                        {selectedSuppliers.map((supplier) => (supplier.name)).join(', ')} 
                </div>

                <Dropdown>
                    <Dropdown.Toggle variant="success" id="dropdown-basic">
                        Select Reductions
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                        {reductions.map((option, index) => (
                            <Dropdown.Item
                                key={index}
                                onClick={() => toggleRed(option)}
                                active={
                                    selectedReductions.includes(option)}
                            >
                                {option.reducedPrice * 100}%
                            </Dropdown.Item>
                        ))}
                    </Dropdown.Menu>
                </Dropdown>

                <div> 
                    <strong>Selected Reductions:</strong>  
                        {selectedReductions.map((reduction) => (reduction.reducedPrice * 100 + `% (${new Date(reduction.startDate).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' })} - ${new Date(reduction.endDate).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' })})`)).join(', ')} 
                </div>

                <Button variant="primary" type="submit" className="w.100">
                    Create Item
                </Button>
            </Form>
        </div>
        </>
    )
}

export default PostItem;