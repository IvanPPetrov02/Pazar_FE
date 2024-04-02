import React from 'react';
import { Dropdown } from 'react-bootstrap';

const CategoryMenu = () => {
    return (
        <Dropdown className="d-flex justify-content-center my-2">
            <Dropdown.Toggle variant="light" id="dropdown-basic">
                Categories
            </Dropdown.Toggle>

            <Dropdown.Menu>
                <Dropdown.Item href="#books">Books</Dropdown.Item>
                <Dropdown.Item href="#clothes">Clothes</Dropdown.Item>
                <Dropdown.Item href="#electronics">Electronics</Dropdown.Item>
                {/* Add more categories as needed */}
            </Dropdown.Menu>
        </Dropdown>
    );
};

export default CategoryMenu;
