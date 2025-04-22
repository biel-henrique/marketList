import express, { json } from "express";
import cors from "cors";
import {status} from "http-status"

const app = express();
app.use(cors());
app.use(json());

const list = [];

app.post("/items", (req, res) => {
    const { name, quantity, type } = req.body;

    if (typeof name === "string") {
        const doubleCheck = list.find((item) => name === item.name);
        if (doubleCheck) {
            return res.status(status.CONFLICT).send('esse item já foi incluído');
        }
        if (typeof quantity === "number") {
            if (typeof type === "string") {
                list.push({ id: list.length + 1, name, quantity, type });
                res.status(status.CREATED).send(list);
            } else {
                return res
                    .status(status.UNPROCESSABLE_ENTITY)
                    .send("O campo type não existe ou está incorreto (string)");
            }
        } else {
            return res
                .status(status.UNPROCESSABLE_ENTITY)
                .send("O campo quantity não existe ou está incorreto(numeric)");
        }
    } else {
        return res
            .status(status.UNPROCESSABLE_ENTITY)
            .send("O campo name não existe ou está incorreto(string)");
    }
});

app.get('/items', (req, res) => {
    const {name, type} = req.query

    if(name || type) {
        let filteredList = list.filter((item) => {
            const checkName = name ? item.name.toLowerCase() === name.toLowerCase() : true
            const checktype = type ? item.type.toLowerCase() === type.toLowerCase() : true
    
            return checkName && checktype
        })

        return res.status(status.OK).send(filteredList)
    }
    return res.status(status.OK).send(list)
})

app.get("/items/:id", (req, res) => {
    const {id} = req.params
    const idNumber = Number(id) 
    if(!Number.isInteger(idNumber)) {
        return res.status(status.BAD_REQUEST).send('Não é um numero inteiro')
    }
    const idList = list.find((item) => item.id === idNumber)
    if(idList) {
        return res.status(status.OK).send(idList)
    }
    return res.status(status.NOT_FOUND).send('id não encontrado')
})

app.listen(5000, () => {
    console.log("server ok!");
});
