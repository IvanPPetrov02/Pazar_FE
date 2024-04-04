import { Dropdown } from 'react-bootstrap';

const CategoryMenu = () => {
    return (
        <Dropdown className="d-flex justify-content-center my-2">
            <Dropdown.Toggle variant="light" id="dropdown-basic">
                Categories
            </Dropdown.Toggle>

            <Dropdown.Menu>
                <Dropdown.Item href="/categories/1/items">1</Dropdown.Item>
                <Dropdown.Item href="/categories/2/items">2</Dropdown.Item>
                <Dropdown.Item href="/categories/3/items">3</Dropdown.Item>
                <Dropdown.Item href="/categories/4/items">4</Dropdown.Item>
                {/* Add more categories as if */}
            </Dropdown.Menu>
        </Dropdown>
    );
};

export default CategoryMenu;
