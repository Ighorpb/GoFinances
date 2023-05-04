import React, {useState} from "react";
import { Input } from "../../components/Form/Input/input";
import { Button } from "../../components/Form/Buttom";
import { TransactionTypeButton } from "../../components/Form/TransactionTypeButton";
import { CategorySelect } from "../../components/Form/CategorySelect";

import {
    Container,
    Header,
    Title,
    Form,
    Fields,
    TransactionsTypes

} from "./styles";

export function Register() {
    const [transactionsType, setTransactionsType] = useState('')

    function handleTransactionTypeSelect(type: 'up' | 'down') {
        setTransactionsType(type)
    }
    return (
        <Container>
            <Header>
                <Title>Cadastro</Title>
            </Header>

            <Form>
                <Fields>
                    <Input
                        placeholder="Nome"
                    />
                    <Input
                        placeholder="Preço"
                        keyboardType='numeric'
                    />

                    <TransactionsTypes>

                        <TransactionTypeButton 
                        title='Income' 
                        type="up" 
                        onPress={() => handleTransactionTypeSelect('up')}
                        isActive={transactionsType === 'up'}
                        />

                        <TransactionTypeButton 
                        title='Outcome'  
                        type="down" 
                        onPress={() => handleTransactionTypeSelect('down')} 
                        isActive={transactionsType === 'down'}
                        />

                    </TransactionsTypes>

                    <CategorySelect title='Categoria' />

                </Fields>

                <Button title="Enviar" />

            </Form>

        </Container>
    );
}