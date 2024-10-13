router.get('/inventory/new', inventoryController.addInventoryView);
router.post('/inventory', inventoryController.addInventory);
