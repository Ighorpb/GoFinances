import React, { useEffect, useState } from "react";
import { Alert, Keyboard, Modal, TouchableWithoutFeedback } from "react-native";
import { useForm } from "react-hook-form";
import * as Yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { InputForm } from "../../components/Form/InputForm";
import { Button } from "../../components/Form/Button";
import { TransactionTypeButton } from "../../components/Form/TransactionTypeButton";
import { CategorySelectButton } from "../../components/Form/CategorySelectButton"
import { CategorySelect } from "../CategorySelect";
import AsyncStorage from "@react-native-async-storage/async-storage";
import uuid from "react-native-uuid"
import { useNavigation } from "@react-navigation/native";

import {
    Container,
    Header,
    Title,
    Form,
    Fields,
    TransactionsTypes

} from "./styles";

interface MyFormData {
    name?: string;
    amount?: string;
}

const schema = Yup.object().shape({
    name: Yup.string().required('Nome é obrigatório'),
    amount: Yup.number().required('Valor é obrigatório')
})

type NavigationProps = {
    navigate: (screen: string) => void;
}
export function Register() {
    const [transactionsType, setTransactionsType] = useState('')
    const [categoryModalOpen, setCategoryModalOpen] = useState(false)



    const [category, setCategory] = useState({
        key: 'category',
        name: 'Categoria',
    });

    const navigation = useNavigation<NavigationProps>()

    const { control, handleSubmit, reset, formState: { errors } } = useForm({
        resolver: yupResolver(schema)
    });



    function handleTransactionTypeSelect(type: 'positive' | 'negative') {
        setTransactionsType(type)
    }

    function handleOpenSelectCategoryModal() {
        setCategoryModalOpen(true)
    }

    function handleCloseSelectCategoryModal() {
        setCategoryModalOpen(false)
    }

    async function handleRegister(form: MyFormData) {
        if (!transactionsType)
            return Alert.alert('Selecione o tipo de transação!')

        if (category.key === 'category')
            return Alert.alert('Selecione a categoria!')

        const newTransaction = {
            id: String(uuid.v4()),
            name: form.name,
            amount: form.amount,
            type: transactionsType,
            category: category.key,
            date: new Date()
        }


        try {
            const dataKey = '@gofinance:transactions';

            const data = await AsyncStorage.getItem(dataKey);
            const currentData = data && data.length ? JSON.parse(data) : []

            currentData.push(newTransaction)
            await AsyncStorage.setItem(dataKey, JSON.stringify(currentData));

            reset();
            setTransactionsType('')
            setCategory({
                key: 'category',
                name: 'Categoty'
            });

            navigation.navigate("Listagem")

        } catch (err) {
            console.log(err)
            Alert.alert("Não foi possível salvar!")
        }
    }





    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <Container>
                <Header>
                    <Title>Cadastro</Title>
                </Header>

                <Form>
                    <Fields>
                        <InputForm
                            name="name"
                            control={control}
                            placeholder="Nome"
                            autoCapitalize="sentences"
                            autoCorrect={false}
                            error={errors.name && errors.name.message}
                        />
                        <InputForm
                            name="amount"
                            control={control}
                            placeholder="Valor"
                            keyboardType="numeric"
                            error={errors.amount && errors.amount.message}

                        />

                        <TransactionsTypes>

                            <TransactionTypeButton
                                title='Income'
                                type="up"
                                onPress={() => handleTransactionTypeSelect('positive')}
                                isActive={transactionsType === 'positive'}
                            />

                            <TransactionTypeButton
                                title='Outcome'
                                type="down"
                                onPress={() => handleTransactionTypeSelect('negative')}
                                isActive={transactionsType === 'negative'}
                            />

                        </TransactionsTypes>

                        <CategorySelectButton title={category.name} onPress={handleOpenSelectCategoryModal} />

                    </Fields>

                    <Button title="Enviar" onPress={handleSubmit(handleRegister)} />

                </Form>

                <Modal visible={categoryModalOpen}>
                    <CategorySelect
                        category={category}
                        setCategory={setCategory}
                        closeSelectCategory={handleCloseSelectCategoryModal}
                    />
                </Modal>
            </Container>
        </TouchableWithoutFeedback>
    );
}