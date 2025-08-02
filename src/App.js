import { useEffect, useState } from 'react';
import { Button, EditableText, InputGroup, Toaster } from '@blueprintjs/core';
import './App.css';

const AppToaster = Toaster.create({
    position: "top"
})

function App() {
    const [users, setUsers] = useState([]);
    const [newtitle, settitle] = useState("")
    const [newcategory, setcategory] = useState("")
    const [newprice, setprice] = useState("")


    useEffect(() => {
        fetch('https://fakestoreapi.com/products')
        .then((response) => response.json() )
        .then((json) => setUsers(json))
    },[])

    function add() {
        const title = newtitle.trim();
        const category = newcategory.trim();
        const price = newprice.trim();

        if (title && category && price) {
            fetch("https://fakestoreapi.com/products",
                {
                    method: "POST",
                    body: JSON.stringify({
                        title,
                        category,
                        price
                    }),
                    headers: {
                        "Content-Type": "application/json; charset=UTF-8 "
                    }
                }
            ).then((response) => response.json() )
            .then(data => {
                setUsers([...users, data]);
                AppToaster.show({
                    message: "user added successfully",
                    intent: 'success',
                    timeout: 3000
                })
                settitle("");
                setcategory("");
                setprice("");

            })
        }

    }

    function onChangeHandler(id, key, value) {
        setUsers((users) => {
            return users.map(user => {
                return user.id === id ? {...user, [key]: value } : user;
            })
        })
    }

    function update(id) {
        const user = users.find((user) => user.id === id );
        fetch(`https://fakestoreapi.com/products/10`,
                {
                    method: "PUT",
                    body: JSON.stringify(user),
                    headers: {
                        "Content-Type": "application/json; charset=UTF-8 "
                    }
                }
            )
        .then( response => response.json())    
        .then(data => {
                AppToaster.show({
                    message: "user updated successfully",
                    intent: 'success',
                    timeout: 3000
                })

        })

    }

    function delete_item(id) {
        fetch(`https://fakestoreapi.com/products/${id}`,
        {
            method: "DELETE",
        })
        .then( response => response.json())    
        .then(data => {
                setUsers((users) => {
                    return users.filter(user => user.id !== id)
                })

                AppToaster.show({
                    message: "user deleted successfully",
                    intent: 'success',
                    timeout: 3000
                })

        })
    }

  return (
    <div className="App">
   <h1>PRODUCT LIST</h1>
        <table className='bp4-html-table modifier'>
            <thead>
                <th>ID</th>
                <th>TITLE</th>
                <th>CATEGORY</th>
                <th>PRICE</th>
                <th>Action</th>
            </thead>
            <tbody>
                {users.map(user => 
                    <tr key={user.id}>
                        <td>{user.id}</td>
                        <td>{user.title}</td>
                        <td><EditableText onChange={value => onChangeHandler(user.id, 'category',  value)} value={user.category} /></td>
                        <td><EditableText onChange={value => onChangeHandler(user.id, 'price',  value)} value={user.price}/></td>
                        <td>
                            <Button intent='primary' onClick={() => update(user.id)}>Update</Button>
                            &nbsp;
                            <Button intent='danger' onClick={() => delete_item(user.id)} >Delete</Button>
                        </td>
                    </tr>
                )}
            </tbody>
            <tfoot>
                <tr>
                    <td></td>
                    <td>
                        <InputGroup
                            value={newtitle}
                            onChange={(e) => settitle(e.target.value) }
                            placeholder='Enter Title...'
                        />
                    </td>
                    <td>
                        <InputGroup
                            value={newcategory}
                            onChange={(e) => setcategory(e.target.value) }
                            placeholder='Enter category...'
                        />
                    </td>
                    <td>
                        <InputGroup
                            value={newprice}
                            onChange={(e) => setprice(e.target.value) }
                            placeholder='Enter price...'
                        />
                    </td>
                    <td>
                        <Button intent='success' onClick={add}>Add </Button>
                    </td>
                </tr>
            </tfoot>
        </table>
    </div>
  );
}

export default App;
