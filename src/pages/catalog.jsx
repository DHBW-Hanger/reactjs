import React from 'react';
import {Page, Navbar, List, ListItem, Block, Button, useStore} from 'framework7-react';
import store from '../js/store';

const CatalogPage = () => {
  const products = useStore('products');

  const addProduct = () => {
    store.dispatch('addProduct', {
      id: '4',
      title: 'Apple iPhone 12',
      description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Nisi tempora similique reiciendis.',
    });
  };

  return (
    <Page name="catalog">
      <Navbar title="Catalog"/>
      <List>
        {products.map((product) => (
          <ListItem
            key={product.id}
            title={product.title}
            link={`/product/${product.id}/`}
          />
        ))}
      </List>
      {products.length === 3 && (
        <Block>
          <Button fill onClick={addProduct}>Add Product</Button>
        </Block>
      )}
    </Page>
  );
};

export default CatalogPage;