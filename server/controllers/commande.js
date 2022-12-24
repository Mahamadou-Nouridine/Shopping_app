const clientModel = require('../models/client')
const orderModel = require('../models/order')

//create an order
const createCommande = async (req, res) => {
    const { clientName, commandes } = req.body;
    if (!clientName || !commandes) return res.status(400).json({ message: 'All requirement are needed' })

    const client = await clientModel.findOne({ name: clientName }).exec()
    if (!client) return res.status(400).json({ message: "client doesn't exist" })

    for (let commande of commandes) {
        client.order.push({
            date: new Date().toISOString().slice(0, 10),
            product_name: commande.product.name,
            product_category: commande.product.categorie,
            product_price: commande.product.price,
            number: commande.qty
        })
    }

    const saved = await client.save();
    if (!saved) return res.status(400).json({ message: "server Error" })
    return res.status(201).json({ message: "Order created successfully" })
}


//delete a given order or all orders
const deleteCommande = async (req, res) => {
    const { clientName, commandeId, all } = req.body
    if (!clientName || !commandeId) return res.status(400).json({ message: "All requirement are needed" })

    const client = await clientModel.findOne({ name: clientName }).exec()
    if (!client) return res.status(400).json({ message: "no client found" })

    if (all) {
        client.order = [];
        const saveAll = client.save();
        if (!saveAll) return res.status(400).json({ message: "server error" })
        return res.status(201).json({ message: "All order are deleted" })
    } else {
        client.order.pull({ _id: commandeId });
        const saved = await client.save()
        if (!saved) return res.status(400).json({ message: "server error" })
        return res.status(201).json({ message: "order deleted", order: saved.order })
    }
}


module.exports = {
    createCommande,
    deleteCommande
}