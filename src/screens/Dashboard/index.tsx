import React, { useState, useEffect, useCallback } from 'react';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { isValid } from 'date-fns';
import { HighlightCard } from '../../components/HighlighCard';
import { TransactionCard, TransactionCardProps } from '../../components/TransactionCard';
import { useFocusEffect } from '@react-navigation/native';
import {
    Container,
    Header,
    UserWrapper,
    UserInfo,
    Photo,
    User,
    UserGreeting,
    UserName,
    Icon,
    HighlightCards,
    Transactions,
    Title,
    TransactionsList

} from './styles'



export interface DataListProps extends TransactionCardProps {
    id: string;
}

interface HighlightProps {
    amount: string;
    lastTransaction: string;
}

interface HighlightData {
    entries: HighlightProps;
    expensive: HighlightProps;
    total: HighlightProps;
}
export function Dashboard() {

    const [transactions, setTransactions] = useState<DataListProps[]>([]);
    const [highlightData, setHighlightData] = useState<HighlightData>({} as HighlightData)

    function getLastTransactionDate(
        collections: DataListProps[],
        type: 'positive' | 'negative'
    ): string {
        const lastTransaction = Math.max(
            ...collections
                .filter(transaction => transaction.type === type)
                .map(transaction => {
                    const transactionDate = new Date(transaction.date);
                    return transactionDate instanceof Date && !isNaN(transactionDate.getTime())
                        ? transactionDate.getTime()
                        : 0;
                })
        );

        const formattedDate = new Date(lastTransaction).toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: '2-digit'
        });

        return formattedDate;
    }

    async function loadTransactions() {
        const dataKey = '@gofinances:transactions';
        const response = await AsyncStorage.getItem(dataKey);
        // await AsyncStorage.removeItem(dataKey);
        const transactions = response ? JSON.parse(response) : [];

        let entriesTotal = 0;
        let expensiveTotal = 0;

        const transactionsFormatted: DataListProps[] = transactions.map((item: DataListProps) => {
            if (item.type === 'positive') {
                entriesTotal += Number(item.amount);
            } else {
                expensiveTotal += Number(item.amount);
            }

            const parsedDate = new Date(item.date);
            const isDateValid = isValid(parsedDate);

            const amount = Number(item.amount).toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL'
            });

            const date = isDateValid
                ? Intl.DateTimeFormat('pt-BR', {
                    day: '2-digit',
                    month: '2-digit',
                    year: '2-digit'
                }).format(parsedDate)
                : 'Data inválida';

            return {
                id: item.id,
                name: item.name,
                amount,
                type: item.type,
                category: item.category,
                date
            };
        });

        setTransactions(transactionsFormatted)

        const lastTransactionsEntries = getLastTransactionDate(transactions, 'positive')
        const lastTransactionsExpensive = getLastTransactionDate(transactions, 'negative')
        const totalInterval = `${lastTransactionsEntries} a ${lastTransactionsExpensive}`

        const total = entriesTotal - expensiveTotal

        setHighlightData({
            entries: {
                amount: entriesTotal.toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                }),
                lastTransaction: `Última entrada dia ${lastTransactionsEntries}`,
            },
            expensive: {
                amount: expensiveTotal.toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                }),
                lastTransaction: `Última saída dia ${lastTransactionsExpensive}`,
            },
            total: {
                amount: total.toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                }),
                lastTransaction: totalInterval
            },
        })
    }

    useEffect(() => {
        loadTransactions();


    }, []);

    useFocusEffect(useCallback(() => {
        loadTransactions();
    }, []));

    return (
        <Container>
            <Header>
                <UserWrapper>
                    <UserInfo>
                        <Photo
                            source={{ uri: 'https://avatars.githubusercontent.com/u/69374770?v=4' }}
                        />
                        <User>
                            <UserGreeting> Olá, </UserGreeting>
                            <UserName>Ighor</UserName>
                        </User>

                    </UserInfo>
                    <Icon name="power" />

                </UserWrapper>

            </Header>

            <HighlightCards>
                <HighlightCard
                    type='up'
                    title='Entradas'
                    amount={highlightData.entries?.amount || '0'}
                    lastTransaction={highlightData.entries?.lastTransaction || '0'}
                />

                <HighlightCard
                    type='down'
                    title='Saídas'
                    amount={highlightData.expensive?.amount || '0'}
                    lastTransaction={highlightData.expensive?.lastTransaction || '0'}
                />

                <HighlightCard
                    type='total'
                    title='Total'
                    amount={highlightData.total?.amount || '0'}
                    lastTransaction={highlightData.total?.lastTransaction || '0'}
                />

            </HighlightCards>

            <Transactions>
                <Title>Listagem</Title>
                <TransactionsList
                    data={transactions}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => <TransactionCard data={item} />}
                />

            </Transactions>

        </Container>
    )
}