import React, { useState } from "react";
import { Modal } from "react-native";

import { Input } from "../../components/Form/Input/input";
import { Button } from "../../components/Form/Button";
import { TransactionTypeButton } from "../../components/Form/TransactionTypeButton";
import { CategorySelectButton} from "../../components/Form/CategorySelectButton"
import { CategorySelect } from "../CategorySelect";

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
    const [categoryModalOpen, setCategoryModalOpen] = useState(false)

    const [name, setName] = useState('')
    const [amount, setAmount] = useState('')

    const [category, setCategory] = useState({
        key: 'category',
        name: 'Categoria',
    })


    function handleTransactionTypeSelect(type: 'up' | 'down') {
        setTransactionsType(type)
    }

    function handleOpenSelectCategoryModal() {
        setCategoryModalOpen(true)
    }

    function handleCloseSelectCategoryModal() {
        setCategoryModalOpen(false)
    }

    function handleRegister(){
        console.log(name, amount)
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
                        onChangeText={setName}
                    />
                    <Input
                        placeholder="Valor"
                        onChangeText={setAmount}
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

                    <CategorySelectButton title={category.name} onPress={handleOpenSelectCategoryModal}/>

                </Fields>

                <Button title="Enviar" onPress={handleRegister} />

            </Form>

            <Modal visible={categoryModalOpen}>
                <CategorySelect
                    category={category}
                    setCategory={setCategory}
                    closeSelectCategory={handleCloseSelectCategoryModal}
                />
            </Modal>

        </Container>
    );
}