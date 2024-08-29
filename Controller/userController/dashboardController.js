const User = require('../../model/userSchema');
const Transaction = require('../../model/transactionSchema');

//------------------------ Dashboard ---------------------------

const getDashboard = async (req, res) => {
    try {
        if(req.user){
            const userId = req.user;
            const user = await User.findById(userId);

            const transactions = await Transaction.find({ userId: userId }).sort({ createdAt: -1 });

            res.render('user/dashboard', { title : "Dashboard", user, transactions });
        } else {
            res.redirect('/login');
        }
    } catch (err) {
        console.log(`error while render the Dashboard ${error}`)
        res.status(500).send(err.message);
    }
};


//------------------------ deposit ---------------------------

const deposit = async (req, res) => {
    try {
        const { amount } = req.body;
        const userId = req.user;
        if (amount <= 0) {
            return res.status(400).json({ message: 'Deposit amount must be greater than 0.' });
        }

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }
        user.balance += parseFloat(amount);
        await user.save();

        const order = Math.floor(100000 + Math.random() * 900000)

        const transaction = new Transaction({
            userId: user._id,
            type: 'deposit',
            orderId : order,
            amount: parseFloat(amount)
        });

        await transaction.save();

        res.status(200).json({ message: 'Deposit successful.', balance: user.balance });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error.' });
    }
};


//------------------------ withdraw ---------------------------

const withdraw = async (req, res) => {
    try {
        const { amount } = req.body;
        const userId = req.user;

        if (amount <= 0) {
            return res.status(400).json({ message: 'Withdrawal amount must be greater than 0.' });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        if (user.balance < amount) {
            return res.status(400).json({ message: 'Insufficient balance.' });
        }

        user.balance -= parseFloat(amount);
        await user.save();

        const order = Math.floor(100000 + Math.random() * 900000)

        const transaction = new Transaction({
            userId: user._id,
            type: 'withdraw',
            orderId : order,
            amount: parseFloat(amount)
        });

        await transaction.save();

        res.status(200).json({ message: 'Withdrawal successful.', balance: user.balance });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error.' });
    }
};


const tansaction = async(req,res)=>{
    try{
        if(req.user){
            const userId = req.user;

            const transactions = await Transaction.find({ userId: userId }).sort({ createdAt: -1 });

            res.render('user/transaction', { title : "Transactions",transactions });
        } else {
            res.redirect('/login');
        }
    }catch(error){
        console.log(`error while render the Transaction page ${error}`)
    }
}


//------------------------ Logout ---------------------------

const logout = (req, res) => {
    try {
        res.clearCookie('token');
        res.redirect('/');
    } catch (error) {
        console.log(`error while logout user ${error}`);
    }
}


module.exports = { getDashboard , deposit , withdraw , logout , tansaction }