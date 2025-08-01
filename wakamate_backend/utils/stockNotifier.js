exports.checkStockAlert = (product) => {
    return product.stock <= product.minStock;
};