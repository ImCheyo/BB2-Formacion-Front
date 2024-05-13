import { useEffect, useState } from "react";
import { Button, Dropdown, Form } from "react-bootstrap";
import { Supplier } from "../../types/Supplier.type";
import { Reduction } from "../../types/Reduction.type";
import { useNavigate, useParams } from "react-router-dom";
import { Item } from "../../types/Item.type";
import { User } from "../../types/User.type";

const UpdateItem = () => {

    const [suppliersGet, setSuppliers] = useState<Supplier[]>([]);
    const [reductionsGet, setReductions] = useState<Reduction[]>([]);

    const [item, setItem] = useState({} as Item);

    const [state, setState] = useState("");
    const [selectedSuppliers, setSelectedSuppliers] = useState<Supplier[]>([]); 
    const [selectedReductions, setSelectedReductions] = useState<Reduction[]>([]);
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState(0);
    const [user, setUser] = useState({} as User);
    
    const {itemCode} = useParams();

    const navigate = useNavigate();

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

    useEffect(() => {

        setDescription(item.description)
        setPrice(item.price)
        setUser(item.userDTO)
        setSelectedSuppliers(item.suppliersDTO)
        setSelectedReductions(item.reductionsDTO)
        setState(item.itemStateEnum)

      }, [item]);

    const handleSubmit = async (e: any) => {
        e.preventDefault();

        try{
            const itemStateEnum = state
            const suppliers = selectedSuppliers
            const reductions = selectedReductions

            const response = await fetch(`http://localhost:8080/api/items/${itemCode}`, {
                method: 'PUT',
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({description, price, itemStateEnum, suppliers, reductions, user}),
            });

            console.log("body", {description, price, itemStateEnum, suppliers, reductions, user});

            const data = await response.json();
            console.log("Updated item: ", data);

            navigate("/")
        }catch(error){
            console.error(error)
        }
    }

    useEffect(() => {
        getSuppliers();
        getReductions();
    }, []);

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

    const toggleState = () => {
        
        if (state == "ACTIVE"){
            setState("DISCONTINUED")
        } else (
            setState("ACTIVE")
        )
    }

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

    return(
        <>
        <div className='center-form'>
            <h1>Update Item</h1>
            <Form onSubmit={handleSubmit}>
                <Form.Group controlId="formBasicDescription">
                    <Form.Control
                        type="text"
                        name="description"
                        placeholder='Enter description'
                        value={description}
                        onChange={e => setDescription(e.target.value)}
                    />
                </Form.Group>

                <Form.Group controlId="formBasicPrice">
                    <Form.Control
                        type="number"
                        name="price"
                        placeholder='Enter price'
                        value={price}
                        onChange={e => setPrice(parseFloat(e.target.value))}
                    />
                </Form.Group>

                <Form.Group controlId="formBasicStateActive">
                    <Form.Check
                        name="itemStateEnum"
                        type="switch"
                        id="custom-switch"
                        label={state}
                        checked= {state == "ACTIVE"} 
                        value={state}
                        onChange={toggleState}
                    />
                </Form.Group>

                        <Dropdown>
                            <Dropdown.Toggle variant="success" id="dropdown-basic">
                                Select Suppliers
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                                {suppliersGet.map((option, index) => (
                                    <Dropdown.Item
                                        key={index}
                                        onClick={() => toggleSup(option)}
                                        active={selectedSuppliers && selectedSuppliers.length > 0 && selectedSuppliers.includes(option)}
                                    >
                                        {option.name}
                                    </Dropdown.Item>
                                ))}
                            </Dropdown.Menu>
                        </Dropdown>
                    
                        <div> 
                            <strong>Selected Suppliers:</strong>  
                                {selectedSuppliers?.length > 0 ? selectedSuppliers.map((supplier) => supplier.name).join(', ') : 'None'} 
                        </div>

                        <Dropdown>
                            <Dropdown.Toggle variant="success" id="dropdown-basic">
                                Select Reductions
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                                {reductionsGet.map((option, index) => (
                                    <Dropdown.Item
                                        key={index}
                                        onClick={() => toggleRed(option)}
                                        active={selectedReductions && selectedReductions.length > 0 && selectedReductions.includes(option)}
                                    >
                                        {option.reducedPrice * 100}%
                                    </Dropdown.Item>
                                ))}
                            </Dropdown.Menu>
                        </Dropdown>
                        
                        <div>
                            <strong>Selected Reductions:</strong>
                            {selectedReductions?.length > 0 ? selectedReductions.map((reduction) => (reduction.reducedPrice * 100 + `% (${new Date(reduction.startDate).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' })} - ${new Date(reduction.endDate).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' })})`)).join(', ') : 'None'}
                        </div>
           
                <Button variant="primary" type="submit" className="w.100">
                    Update Item
                </Button>
            </Form>
        </div>
        </>
    )
}

export default UpdateItem;