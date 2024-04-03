import { Dropdown } from 'react-bootstrap';

const CategoryMenu = () => {
    return (
        <Dropdown className="d-flex justify-content-center my-2">
            <Dropdown.Toggle variant="light" id="dropdown-basic">
                Categories
            </Dropdown.Toggle>

            <Dropdown.Menu>
                <Dropdown.Item href="/categories/books">Books</Dropdown.Item>
                {/* Add more categories as if */}
            </Dropdown.Menu>
        </Dropdown>
    );
};

export default CategoryMenu;
