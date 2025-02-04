import { Injectable } from '@angular/core';
import { PrizeInfo } from './models/prize-info';
import { Question } from './models/question';
import * as CryptoJS from 'crypto-js';
import { NavController } from '@ionic/angular';

const STORAGE_KEY = 'questions';
const SECRET_KEY = 'jushow';

@Injectable({
  providedIn: 'root',
})
export class QuestionService {
  private questionCount: number = 0;
  private usedQuestions: number[] = [];
  private questions: Question[] = [];
  private questionPrizes: number[] = [];
  private currentLevel: number = 1; //nivel atual do jogador
  private currentQuestionIndex: number = 0;
  private consecutiveCorrectAnswers = 0;  // Contador de respostas corretas seguidas
  private addedOriginalQuestions: Set<string> = new Set();
  

  private originalQuestions: Question[] = [
    {
      title: 'Um número múltiplo de cinco é?',
      correctAnswer: 1,
      answers: [
        { description: 'Um número que é divisível por 3', isRight: false },
        { description: 'Um número que é divisível por 5', isRight: true },
        { description: 'Um número que multiplicado por 5 é par', isRight: false },
        { description: 'Um número que somado com 5 é impar', isRight: false },
      ],
      level: 1, // Conhecimento básico
    },
    {
      title: 'Qual o nome do principal personagem do anime Dragon Ball?',
      correctAnswer: 0,
      answers: [
        { description: 'Goku', isRight: true },
        { description: 'Freeza', isRight: false },
        { description: 'Mabel', isRight: false },
        { description: 'Leon Kennedy', isRight: false },
      ],
      level: 1, // Cultura pop básica
    },
    {
      title: 'De quanto em quanto tempo acontece uma Copa do Mundo?',
      correctAnswer: 3,
      answers: [
        { description: 'De dois em dois anos', isRight: false },
        { description: 'De oito em oitro anos', isRight: false },
        { description: 'Ocorre todos os anos', isRight: false },
        { description: 'De quatro em quatro anos', isRight: true },
      ],
      level: 1, // Conhecimento geral
    },
    {
      title: 'Quantos meses do ano possuem 28 dias?',
      correctAnswer: 3,
      answers: [
        { description: 'Apenas um mês', isRight: false },
        { description: 'Seis meses', isRight: false },
        { description: 'Oito meses', isRight: false },
        { description: 'Doze meses', isRight: true },
      ],
      level: 2, // Pegadinha, demanda atenção
    },
    {
      title: 'Qual a cor que simboliza a esperança?',
      correctAnswer: 1,
      answers: [
        { description: 'Branco', isRight: false },
        { description: 'Verde', isRight: true },
        { description: 'Azul', isRight: false },
        { description: 'Vermelho', isRight: false },
      ],
      level: 1, // Conhecimento básico
    },
    {
      title: 'Quais os dois primeiros nomes da apresentadora Xuxa?',
      correctAnswer: 2,
      answers: [
        { description: 'Maria de Lourdes', isRight: false },
        { description: 'Maria do Carmo', isRight: false },
        { description: 'Maria da Graça', isRight: true },
        { description: 'Maria Isabel', isRight: false },
      ],
      level: 2, // Específico, público-alvo pode conhecer
    },
    {
      title:
        'Qual o presidente brasileiro responsável pela construção de Brasília?',
      correctAnswer: 1,
      answers: [
        { description: 'Jânio Quadros', isRight: false },
        { description: 'Juscelino Kubitschek', isRight: true },
        { description: 'Getúlio Vargas', isRight: false },
        { description: 'Eurico Gaspar Dutra', isRight: false },
      ],
      level: 2, // História do Brasil
    },
    {
      title: 'Como chamamos o sono do urso durante o inverno?',
      correctAnswer: 3,
      answers: [
        { description: 'Preguiça', isRight: false },
        { description: 'Demaio', isRight: false },
        { description: 'Cochilo', isRight: false },
        { description: 'Hibernação', isRight: true },
      ],
      level: 1, // Conhecimento básico
    },
    {
      title: 'Segundo a lenda em que fase da lua aparece o lobisomem?',
      correctAnswer: 1,
      answers: [
        { description: 'Nova', isRight: false },
        { description: 'Cheia', isRight: true },
        { description: 'Minguante', isRight: false },
        { description: 'Crescente', isRight: false },
      ],
      level: 1, // Conhecimento básico de folclore
    },
    {
      title: 'Em que ano foi morto John Lennon?',
      correctAnswer: 0,
      answers: [
        { description: '1980', isRight: true },
        { description: '1985', isRight: false },
        { description: '1981', isRight: false },
        { description: '1978', isRight: false },
      ],
      level: 3, // Conhecimento específico
    },
    {
      title: 'Qual foi o último estado criado no Brasil?',
      correctAnswer: 0,
      answers: [
        { description: 'Tocantins', isRight: true },
        { description: 'Rondônia', isRight: false },
        { description: 'Acre', isRight: false },
        { description: 'Mato Grosso do Sul', isRight: false },
      ],
      level: 2, // História e geografia
    },
    {
      title: 'Em qual dos clubes abaixo o jogador Yuri Alberto é ídolo?',
      correctAnswer: 1,
      answers: [
        { description: 'Santos', isRight: false },
        { description: 'Corinthians', isRight: true },
        { description: 'Bahia', isRight: false },
        { description: 'São Paulo', isRight: false },
      ],
      level: 2, // Atualidades do futebol
    },
    {
      title: 'Em qual estado brasileiro ocorreu a guerra de canudos?',
      correctAnswer: 1,
      answers: [
        { description: 'Sergipe', isRight: false },
        { description: 'Bahia', isRight: true },
        { description: 'São Paulo', isRight: false },
        { description: 'Rio de Janeiro', isRight: false },
      ],
      level: 2, // História regional
    },
    {
      title: 'Qual o nome que se dá a mistura de água com sal?',
      correctAnswer: 1,
      answers: [
        { description: 'Gangorra', isRight: false },
        { description: 'Salmoura', isRight: true },
        { description: 'Melado', isRight: false },
        { description: 'Salada', isRight: false },
      ],
      level: 1, // Conhecimento básico
    },
    {
      title: 'De onde as abelhas extraem o mel?',
      correctAnswer: 1,
      answers: [
        { description: 'Rochas', isRight: false },
        { description: 'Flores', isRight: true },
        { description: 'Terra', isRight: false },
        { description: 'Água', isRight: false },
      ],
      level: 1, // Conhecimento básico
    },
    {
      title: 'Qual é o maior país em extensão territorial do mundo?',
      correctAnswer: 0,
      answers: [
        { description: 'Rússia', isRight: true },
        { description: 'Canadá', isRight: false },
        { description: 'China', isRight: false },
        { description: 'Estados Unidos', isRight: false },
      ],
      level: 1, // Geografia básica
    },
    {
      title: 'Qual é o animal mais rápido do mundo em terra?',
      correctAnswer: 2,
      answers: [
        { description: 'Leopardo', isRight: false },
        { description: 'Leão', isRight: false },
        { description: 'Guepardo', isRight: true },
        { description: 'Tigre', isRight: false },
      ],
      level: 1, // Biologia básica
    },
    {
      title: 'Qual é o maior oceano da Terra?',
      correctAnswer: 1,
      answers: [
        { description: 'Oceano Atlântico', isRight: false },
        { description: 'Oceano Pacífico', isRight: true },
        { description: 'Oceano Índico', isRight: false },
        { description: 'Oceano Ártico', isRight: false },
      ],
      level: 1, // Geografia básica
    },
    {
      title: 'Quem pintou a Mona Lisa?',
      correctAnswer: 3,
      answers: [
        { description: 'Michelangelo', isRight: false },
        { description: 'Rafael', isRight: false },
        { description: 'Donatello', isRight: false },
        { description: 'Leonardo da Vinci', isRight: true },
      ],
      level: 2, // Arte e cultura
    },
    {
      title: 'Qual é a capital da Argentina?',
      correctAnswer: 0,
      answers: [
        { description: 'Buenos Aires', isRight: true },
        { description: 'Rosário', isRight: false },
        { description: 'Córdoba', isRight: false },
        { description: 'Mendoza', isRight: false },
      ],
      level: 1, // Geografia da América do Sul
    },
    {
      title: 'Em que continente fica o Egito?',
      correctAnswer: 2,
      answers: [
        { description: 'Europa', isRight: false },
        { description: 'América', isRight: false },
        { description: 'África', isRight: true },
        { description: 'Ásia', isRight: false },
      ],
      level: 1, // Geografia básica
    },
    {
      title: 'Qual o nome do primeiro homem a pisar na Lua?',
      correctAnswer: 1,
      answers: [
        { description: 'Buzz Aldrin', isRight: false },
        { description: 'Neil Armstrong', isRight: true },
        { description: 'Yuri Gagarin', isRight: false },
        { description: 'Michael Collins', isRight: false },
      ],
      level: 1, // História da ciência
    },
    {
      title: 'Qual é a maior floresta tropical do mundo?',
      correctAnswer: 0,
      answers: [
        { description: 'Floresta Amazônica', isRight: true },
        { description: 'Floresta do Congo', isRight: false },
        { description: 'Floresta da Malásia', isRight: false },
        { description: 'Floresta da Indonésia', isRight: false },
      ],
      level: 1, // Geografia básica
    },
    {
      title: 'Qual invenção é atribuída a Santos Dumont?',
      correctAnswer: 2,
      answers: [
        { description: 'Telefone', isRight: false },
        { description: 'Submarino', isRight: false },
        { description: 'Avião', isRight: true },
        { description: 'Rádio', isRight: false },
      ],
      level: 1, // História brasileira
    },
    {
      title: 'Qual país é conhecido como “a terra do sol nascente”?',
      correctAnswer: 3,
      answers: [
        { description: 'Coreia do Sul', isRight: false },
        { description: 'China', isRight: false },
        { description: 'Tailândia', isRight: false },
        { description: 'Japão', isRight: true },
      ],
      level: 1, // Geografia básica
    },
    {
      title: 'Quem é o autor da obra “Dom Casmurro”?',
      correctAnswer: 1,
      answers: [
        { description: 'José de Alencar', isRight: false },
        { description: 'Machado de Assis', isRight: true },
        { description: 'Manuel Bandeira', isRight: false },
        { description: 'Carlos Drummond de Andrade', isRight: false },
      ],
      level: 2, // Literatura brasileira
    },
    {
      title: 'Qual é a capital da França?',
      correctAnswer: 1,
      answers: [
        { description: 'Lyon', isRight: false },
        { description: 'Paris', isRight: true },
        { description: 'Marselha', isRight: false },
        { description: 'Bordéus', isRight: false },
      ],
      level: 1, // Geografia básica
    },
  
    {
      title: 'Qual é o maior planeta do Sistema Solar?',
      correctAnswer: 2,
      answers: [
        { description: 'Saturno', isRight: false },
        { description: 'Urano', isRight: false },
        { description: 'Júpiter', isRight: true },
        { description: 'Netuno', isRight: false },
      ],
      level: 1, // Ciência básica
    },
    {
      title: 'Em que cidade brasileira fica o Cristo Redentor?',
      correctAnswer: 3,
      answers: [
        { description: 'Salvador', isRight: false },
        { description: 'São Paulo', isRight: false },
        { description: 'Belo Horizonte', isRight: false },
        { description: 'Rio de Janeiro', isRight: true },
      ],
      level: 1, // Cultura geral
    },
    {
      title: 'Qual é a moeda oficial do Reino Unido?',
      correctAnswer: 0,
      answers: [
        { description: 'Libra Esterlina', isRight: true },
        { description: 'Euro', isRight: false },
        { description: 'Dólar', isRight: false },
        { description: 'Franco', isRight: false },
      ],
      level: 2, // Economia e geopolítica
    },
    {
      title: 'Qual desses animais é um mamífero?',
      correctAnswer: 1,
      answers: [
        { description: 'Pinguim', isRight: false },
        { description: 'Golfinho', isRight: true },
        { description: 'Galinha', isRight: false },
        { description: 'Tartaruga', isRight: false },
      ],
      level: 1, // Ciências naturais
    },
    {
      title: 'Quem foi o primeiro presidente do Brasil?',
      correctAnswer: 2,
      answers: [
        { description: 'Dom Pedro II', isRight: false },
        { description: 'Floriano Peixoto', isRight: false },
        { description: 'Deodoro da Fonseca', isRight: true },
        { description: 'Prudente de Morais', isRight: false },
      ],
      level: 2, // História brasileira
    },
    {
      title: 'Qual esporte é conhecido como “o esporte bretão”?',
      correctAnswer: 0,
      answers: [
        { description: 'Futebol', isRight: true },
        { description: 'Críquete', isRight: false },
        { description: 'Rúgbi', isRight: false },
        { description: 'Golfe', isRight: false },
      ],
      level: 1, // Esportes populares
    },
    {
      title: 'Qual é o idioma oficial da China?',
      correctAnswer: 1,
      answers: [
        { description: 'Cantonês', isRight: false },
        { description: 'Mandarim', isRight: true },
        { description: 'Inglês', isRight: false },
        { description: 'Hindi', isRight: false },
      ],
      level: 1, // Cultura geral
    },
    {
      title: 'Qual metal é extraído da bauxita?',
      correctAnswer: 2,
      answers: [
        { description: 'Ferro', isRight: false },
        { description: 'Cobre', isRight: false },
        { description: 'Alumínio', isRight: true },
        { description: 'Níquel', isRight: false },
      ],
      level: 3, // Ciências da Terra
    },
    {
      title: 'Qual foi o primeiro país a sediar uma Copa do Mundo de futebol?',
      correctAnswer: 0,
      answers: [
        { description: 'Uruguai', isRight: true },
        { description: 'Brasil', isRight: false },
        { description: 'Itália', isRight: false },
        { description: 'Alemanha', isRight: false },
      ],
      level: 2, // História do esporte
    },
    {
      title: 'Qual é o maior mamífero terrestre?',
      correctAnswer: 1,
      answers: [
        { description: 'Hipopótamo', isRight: false },
        { description: 'Elefante', isRight: true },
        { description: 'Rinoceronte', isRight: false },
        { description: 'Girafa', isRight: false },
      ],
      level: 1, // Biologia
    },
    {
      title: 'Quem é o autor da teoria da relatividade?',
      correctAnswer: 2,
      answers: [
        { description: 'Isaac Newton', isRight: false },
        { description: 'Galileu Galilei', isRight: false },
        { description: 'Albert Einstein', isRight: true },
        { description: 'Nikola Tesla', isRight: false },
      ],
      level: 2, // Física básica
    },
    {
      title: 'Qual cidade é conhecida como a “Cidade Luz”?',
      correctAnswer: 1,
      answers: [
        { description: 'Londres', isRight: false },
        { description: 'Paris', isRight: true },
        { description: 'Veneza', isRight: false },
        { description: 'Nova York', isRight: false },
      ],
      level: 1, // Cultura geral
    },
    {
      title: 'Qual destas estruturas foi construída pelos antigos egípcios?',
      correctAnswer: 0,
      answers: [
        { description: 'Pirâmides', isRight: true },
        { description: 'Coliseu', isRight: false },
        { description: 'Muralha da China', isRight: false },
        { description: 'Taj Mahal', isRight: false },
      ],
      level: 1, // História mundial
    },
    {
      title: 'Qual destes animais é um inseto?',
      correctAnswer: 3,
      answers: [
        { description: 'Aranha', isRight: false },
        { description: 'Escorpião', isRight: false },
        { description: 'Caramujo', isRight: false },
        { description: 'Formiga', isRight: true },
      ],
      level: 1, // Ciências naturais
    },
    {
      title: 'Qual é a montanha mais alta do mundo?',
      correctAnswer: 1,
      answers: [
        { description: 'K2', isRight: false },
        { description: 'Monte Everest', isRight: true },
        { description: 'Kangchenjunga', isRight: false },
        { description: 'Makalu', isRight: false },
      ],
      level: 2, // Geografia avançada
    },
  
    {
      title: 'Qual é a capital do estado brasileiro de Minas Gerais?',
      correctAnswer: 3,
      answers: [
        { description: 'Ouro Preto', isRight: false },
        { description: 'Diamantina', isRight: false },
        { description: 'Juiz de Fora', isRight: false },
        { description: 'Belo Horizonte', isRight: true },
      ],
      level: 1, //Geografia Básica
    },
  
    {
      title: 'Em que continente se localiza o Brasil?',
      correctAnswer: 2,
      answers: [
        { description: 'Europa', isRight: false },
        { description: 'África', isRight: false },
        { description: 'América do Sul', isRight: true },
        { description: 'Ásia', isRight: false },
      ],
      level: 1, //geografia básica
    },
  
    {
      title: 'Qual destes escritores é brasileiro?',
      correctAnswer: 3,
      answers: [
        { description: 'Gabriel García Márquez', isRight: false },
        { description: 'Pablo Neruda', isRight: false },
        { description: 'Jorge Luis Borges', isRight: false },
        { description: 'Jorge Amado', isRight: true },
      ],
      level: 2, //cultura específica
    },
// História
{
  title: 'A Torre Eiffel fica em qual país?',
  correctAnswer: 1,
  answers: [
    { description: 'Itália', isRight: false },
    { description: 'França', isRight: true },
    { description: 'Espanha', isRight: false },
    { description: 'Alemanha', isRight: false },
  ],
  level: 1,
},

// Ciências
{
  title: 'Qual invenção é atribuída a Alexander Graham Bell?',
  correctAnswer: 0,
  answers: [
    { description: 'Telefone', isRight: true },
    { description: 'Televisão', isRight: false },
    { description: 'Internet', isRight: false },
    { description: 'Rádio', isRight: false },
  ],
  level: 2,
},

// História do Brasil
{
  title: 'Quem descobriu o Brasil, segundo a história oficial?',
  correctAnswer: 2,
  answers: [
    { description: 'Américo Vespúcio', isRight: false },
    { description: 'Cristóvão Colombo', isRight: false },
    { description: 'Pedro Álvares Cabral', isRight: true },
    { description: 'Vasco da Gama', isRight: false },
  ],
  level: 1,
},

// Geografia
{
  title: 'Em que país fica a cidade de Nova York?',
  correctAnswer: 1,
  answers: [
    { description: 'Canadá', isRight: false },
    { description: 'Estados Unidos', isRight: true },
    { description: 'Inglaterra', isRight: false },
    { description: 'Austrália', isRight: false },
  ],
  level: 1,
},

// Astronomia
{
  title: 'Qual destes é um planeta anão?',
  correctAnswer: 0,
  answers: [
    { description: 'Plutão', isRight: true },
    { description: 'Marte', isRight: false },
    { description: 'Vênus', isRight: false },
    { description: 'Mercúrio', isRight: false },
  ],
  level: 2,
},

// Geografia
{
  title: 'Qual o nome da capital de Portugal?',
  correctAnswer: 2,
  answers: [
    { description: 'Porto', isRight: false },
    { description: 'Coimbra', isRight: false },
    { description: 'Lisboa', isRight: true },
    { description: 'Faro', isRight: false },
  ],
  level: 1,
},

// Geografia
{
  title: 'Qual é o maior rio do mundo em extensão?',
  correctAnswer: 0,
  answers: [
    { description: 'Rio Nilo', isRight: true },
    { description: 'Rio Amazonas', isRight: false },
    { description: 'Rio Yangtzé', isRight: false },
    { description: 'Rio Mississippi', isRight: false },
  ],
  level: 2,
},

// Esportes
{
  title: 'Qual esporte Pelé tornou-se mundialmente famoso?',
  correctAnswer: 1,
  answers: [
    { description: 'Basquete', isRight: false },
    { description: 'Futebol', isRight: true },
    { description: 'Vôlei', isRight: false },
    { description: 'Tênis', isRight: false },
  ],
  level: 1,
},

// Cultura Geral
{
  title: 'A Estátua da Liberdade foi um presente de qual país para os EUA?',
  correctAnswer: 3,
  answers: [
    { description: 'Inglaterra', isRight: false },
    { description: 'Alemanha', isRight: false },
    { description: 'Espanha', isRight: false },
    { description: 'França', isRight: true },
  ],
  level: 1,
},

// Geografia
{
  title: 'Qual é o maior estado do Brasil em área?',
  correctAnswer: 0,
  answers: [
    { description: 'Amazonas', isRight: true },
    { description: 'Mato Grosso', isRight: false },
    { description: 'Pará', isRight: false },
    { description: 'Minas Gerais', isRight: false },
  ],
  level: 2,
},

// Geografia
{
  title: 'Qual destes países faz parte do Reino Unido?',
  correctAnswer: 1,
  answers: [
    { description: 'Irlanda', isRight: false },
    { description: 'Escócia', isRight: true },
    { description: 'Noruega', isRight: false },
    { description: 'Suécia', isRight: false },
  ],
  level: 2,
},

// Ciências
{
  title: 'Qual o elemento químico mais abundante no Universo?',
  correctAnswer: 0,
  answers: [
    { description: 'Hidrogênio', isRight: true },
    { description: 'Oxigênio', isRight: false },
    { description: 'Carbono', isRight: false },
    { description: 'Hélio', isRight: false },
  ],
  level: 3,
},

// Cultura Geral
{
  title: 'Quem é o criador do personagem “Mickey Mouse”?',
  correctAnswer: 1,
  answers: [
    { description: 'Hanna-Barbera', isRight: false },
    { description: 'Walt Disney', isRight: true },
    { description: 'Stan Lee', isRight: false },
    { description: 'Matt Groening', isRight: false },
  ],
  level: 1,
},

// História
{
  title: 'A muralha da China foi construída para proteger contra quais invasores?',
  correctAnswer: 3,
  answers: [
    { description: 'Árabes', isRight: false },
    { description: 'Vikings', isRight: false },
    { description: 'Persas', isRight: false },
    { description: 'Mongóis', isRight: true },
  ],
  level: 2,
},

// Música
{
  title: 'Qual destes compositores é austríaco?',
  correctAnswer: 0,
  answers: [
    { description: 'Wolfgang Amadeus Mozart', isRight: true },
    { description: 'Ludwig van Beethoven', isRight: false },
    { description: 'Johann Sebastian Bach', isRight: false },
    { description: 'Frédéric Chopin', isRight: false },
  ],
  level: 3,
},

// Geografia
{
  title: 'Qual é o continente mais frio da Terra?',
  correctAnswer: 3,
  answers: [
    { description: 'Europa', isRight: false },
    { description: 'América do Norte', isRight: false },
    { description: 'Ásia', isRight: false },
    { description: 'Antártida', isRight: true },
  ],
  level: 1,
},

// Artes
{
  title: 'Quem pintou o teto da Capela Sistina?',
  correctAnswer: 0,
  answers: [
    { description: 'Michelangelo', isRight: true },
    { description: 'Leonardo da Vinci', isRight: false },
    { description: 'Sandro Botticelli', isRight: false },
    { description: 'Rafael', isRight: false },
  ],
  level: 3, //específica
},
  // Geografia
  {
    title: 'Qual país é conhecido por ter um formato semelhante a uma bota?',
    correctAnswer: 1,
    answers: [
      { description: 'Portugal', isRight: false },
      { description: 'Itália', isRight: true },
      { description: 'Grécia', isRight: false },
      { description: 'Croácia', isRight: false },
    ],
    level: 1,
  },

  // Literatura
  {
    title: 'Qual escritor criou o personagem Sherlock Holmes?',
    correctAnswer: 0,
    answers: [
      { description: 'Arthur Conan Doyle', isRight: true },
      { description: 'Agatha Christie', isRight: false },
      { description: 'Edgar Allan Poe', isRight: false },
      { description: 'Bram Stoker', isRight: false },
    ],
    level: 2,
  },

  // Biologia
  {
    title: 'Qual destes animais é um réptil?',
    correctAnswer: 3,
    answers: [
      { description: 'Sapo', isRight: false },
      { description: 'Foca', isRight: false },
      { description: 'Gaivota', isRight: false },
      { description: 'Cobra', isRight: true },
    ],
    level: 1,
  },

  // História
  {
    title: 'Qual evento marcou o fim da Idade Média?',
    correctAnswer: 2,
    answers: [
      { description: 'Descoberta do fogo', isRight: false },
      { description: 'Queda de Roma', isRight: false },
      { description: 'Queda de Constantinopla', isRight: true },
      { description: 'Revolução Francesa', isRight: false },
    ],
    level: 3,
  },

  // Ciências
  {
    title: 'Qual órgão do corpo humano é responsável por bombear sangue?',
    correctAnswer: 1,
    answers: [
      { description: 'Pulmão', isRight: false },
      { description: 'Coração', isRight: true },
      { description: 'Rim', isRight: false },
      { description: 'Fígado', isRight: false },
    ],
    level: 1,
  },

  // Geografia
  {
    title: 'Qual destas línguas é oficial na Suíça?',
    correctAnswer: 0,
    answers: [
      { description: 'Alemão', isRight: true },
      { description: 'Espanhol', isRight: false },
      { description: 'Inglês', isRight: false },
      { description: 'Holandês', isRight: false },
    ],
    level: 2,
  },

  // Astronomia
  {
    title: 'Quem foi o primeiro homem a viajar para o espaço?',
    correctAnswer: 2,
    answers: [
      { description: 'Neil Armstrong', isRight: false },
      { description: 'John Glenn', isRight: false },
      { description: 'Yuri Gagarin', isRight: true },
      { description: 'Laika', isRight: false },
    ],
    level: 2,
  },

  // Religião
  {
    title: 'Qual é a principal religião da Índia?',
    correctAnswer: 3,
    answers: [
      { description: 'Cristianismo', isRight: false },
      { description: 'Islamismo', isRight: false },
      { description: 'Budismo', isRight: false },
      { description: 'Hinduísmo', isRight: true },
    ],
    level: 1,
  },

  // Geografia
  {
    title: 'Qual destes países faz fronteira com o Brasil?',
    correctAnswer: 0,
    answers: [
      { description: 'Argentina', isRight: true },
      { description: 'Costa Rica', isRight: false },
      { description: 'Panamá', isRight: false },
      { description: 'México', isRight: false },
    ],
    level: 1,
  },

  // Cultura Brasileira
  {
    title: 'Qual cantora brasileira ficou conhecida mundialmente como “Rainha do Samba” e imortalizou a canção “Aquarela do Brasil” em Hollywood?',
    correctAnswer: 2,
    answers: [
      { description: 'Elza Soares', isRight: false },
      { description: 'Clara Nunes', isRight: false },
      { description: 'Carmen Miranda', isRight: true },
      { description: 'Beth Carvalho', isRight: false },
    ],
    level: 2,
  },

  // Literatura
  {
    title: 'Qual escritor brasileiro é autor de “Memórias Póstumas de Brás Cubas”?',
    correctAnswer: 3,
    answers: [
      { description: 'Jorge Amado', isRight: false },
      { description: 'Carlos Drummond de Andrade', isRight: false },
      { description: 'José de Alencar', isRight: false },
      { description: 'Machado de Assis', isRight: true },
    ],
    level: 3,
  },

  // Cultura Brasileira
  {
    title: 'Qual é o nome da maior festa popular do Brasil, famosa em cidades como Salvador e Rio de Janeiro?',
    correctAnswer: 0,
    answers: [
      { description: 'Carnaval', isRight: true },
      { description: 'Festa Junina', isRight: false },
      { description: 'Bumba Meu Boi', isRight: false },
      { description: 'Parintins', isRight: false },
    ],
    level: 1,
  },

  // Música
  {
    title: 'Qual estilo musical brasileiro é reconhecido por seu ritmo sincopado e por ter surgido no final do século XIX no Rio de Janeiro?',
    correctAnswer: 1,
    answers: [
      { description: 'Frevo', isRight: false },
      { description: 'Samba', isRight: true },
      { description: 'Forró', isRight: false },
      { description: 'Maracatu', isRight: false },
    ],
    level: 1,
  },

  // Literatura Infantil
  {
    title: 'Qual é a principal inspiração literária da personagem Emília, do Sítio do Picapau Amarelo?',
    correctAnswer: 3,
    answers: [
      { description: 'Uma fada do folclore brasileiro', isRight: false },
      { description: 'Uma boneca francesa', isRight: false },
      { description: 'Um brinquedo indígena', isRight: false },
      { description: 'Uma boneca de pano criada por Monteiro Lobato', isRight: true },
    ],
    level: 2,
  },

  // Música
  {
    title: 'Que cantora brasileira é conhecida como a “Pimentinha” e interpretou canções de Tom Jobim e Vinicius de Moraes?',
    correctAnswer: 2,
    answers: [
      { description: 'Maria Bethânia', isRight: false },
      { description: 'Gal Costa', isRight: false },
      { description: 'Elis Regina', isRight: true },
      { description: 'Nara Leão', isRight: false },
    ],
    level: 2,
  },

  // Geografia
  {
    title: 'Qual cidade brasileira é famosa pelas praias de Copacabana e Ipanema?',
    correctAnswer: 1,
    answers: [
      { description: 'Salvador', isRight: false },
      { description: 'Rio de Janeiro', isRight: true },
      { description: 'Recife', isRight: false },
      { description: 'Natal', isRight: false },
    ],
    level: 1,
  },

   // Literatura Infantil
  {
    title: 'Quem é o criador da “Turma da Mônica”, uma das mais famosas histórias em quadrinhos do Brasil?',
    correctAnswer: 0,
    answers: [
      { description: 'Mauricio de Sousa', isRight: true },
      { description: 'Ziraldo', isRight: false },
      { description: 'Laerte', isRight: false },
      { description: 'Henfil', isRight: false },
    ],
    level: 1,
  },

  // Esportes
  {
    title: 'Qual é o time brasileiro conhecido como “Mengão”?',
    correctAnswer: 1,
    answers: [
      { description: 'Corinthians', isRight: false },
      { description: 'Flamengo', isRight: true },
      { description: 'São Paulo', isRight: false },
      { description: 'Palmeiras', isRight: false },
    ],
    level: 1,
  },

  // Música
  {
    title: 'Qual é o gênero musical brasileiro criado no final da década de 1950, que mescla samba e jazz, e tornou-se internacionalmente famoso através de Tom Jobim e João Gilberto?',
    correctAnswer: 2,
    answers: [
      { description: 'Tropicália', isRight: false },
      { description: 'MPB', isRight: false },
      { description: 'Bossa Nova', isRight: true },
      { description: 'Choro', isRight: false },
    ],
    level: 2,
  },

  // Gastronomia
  {
    title: 'Qual prato típico brasileiro é feito com feijão preto, carnes salgadas e defumadas, e é servido tradicionalmente aos sábados?',
    correctAnswer: 3,
    answers: [
      { description: 'Vatapá', isRight: false },
      { description: 'Moqueca', isRight: false },
      { description: 'Acarajé', isRight: false },
      { description: 'Feijoada', isRight: true },
    ],
    level: 1,
  },

  // Esportes
  {
    title: 'Qual foi o futebolista brasileiro eleito melhor do mundo pela FIFA em 2007?',
    correctAnswer: 2,
    answers: [
      { description: 'Ronaldinho Gaúcho', isRight: false },
      { description: 'Ronaldo Fenômeno', isRight: false },
      { description: 'Kaká', isRight: true },
      { description: 'Neymar', isRight: false },
    ],
    level: 2,
  },

  // Música
  {
    title: 'Qual artista brasileiro é conhecido como “o Rei” e consolidou a música romântica no país, especialmente nas décadas de 1960 e 1970?',
    correctAnswer: 0,
    answers: [
      { description: 'Roberto Carlos', isRight: true },
      { description: 'Erasmo Carlos', isRight: false },
      { description: 'Chico Buarque', isRight: false },
      { description: 'Caetano Veloso', isRight: false },
    ],
    level: 2,
  },

  // Folclore
  {
    title: 'Qual personagem do folclore brasileiro é conhecido por suas travessuras e por ter apenas uma perna?',
    correctAnswer: 0,
    answers: [
      { description: 'Saci-Pererê', isRight: true },
      { description: 'Curupira', isRight: false },
      { description: 'Boitatá', isRight: false },
      { description: 'Iara', isRight: false },
    ],
    level: 1,
  },

  // Televisão
  {
    title: 'Qual dançarina e apresentadora brasileira ficou conhecida pelo programa “Planeta Xuxa”?',
    correctAnswer: 0,
    answers: [
      { description: 'Xuxa Meneghel', isRight: true },
      { description: 'Sabrina Sato', isRight: false },
      { description: 'Carla Perez', isRight: false },
      { description: 'Mariana Ximenes', isRight: false },
    ],
    level: 1,
  },

  // Literatura
  {
    title: 'Qual escritor baiano é autor de “Gabriela, Cravo e Canela” e “Capitães da Areia”?',
    correctAnswer: 3,
    answers: [
      { description: 'Graciliano Ramos', isRight: false },
      { description: 'Mário de Andrade', isRight: false },
      { description: 'Raquel de Queiroz', isRight: false },
      { description: 'Jorge Amado', isRight: true },
    ],
    level: 2,
  },

  // Cultura Brasileira
  {
    title: 'Qual estado brasileiro é famoso pelo frevo, maracatu e pelo Galo da Madrugada no Carnaval?',
    correctAnswer: 2,
    answers: [
      { description: 'Bahia', isRight: false },
      { description: 'Rio de Janeiro', isRight: false },
      { description: 'Pernambuco', isRight: true },
      { description: 'Ceará', isRight: false },
    ],
    level: 2,
  },

  // Esportes
  {
    title: 'Qual jogador brasileiro é conhecido como “o Anjo das Pernas Tortas”?',
    correctAnswer: 1,
    answers: [
      { description: 'Zico', isRight: false },
      { description: 'Garrincha', isRight: true },
      { description: 'Rivelino', isRight: false },
      { description: 'Sócrates', isRight: false },
    ],
    level: 2,
  },

  // Arquitetura
  {
    title: 'Qual arquiteto brasileiro foi responsável pelo projeto urbanístico de Brasília?',
    correctAnswer: 0,
    answers: [
      { description: 'Lúcio Costa', isRight: true },
      { description: 'Oscar Niemeyer', isRight: false },
      { description: 'Paulo Mendes da Rocha', isRight: false },
      { description: 'Burle Marx', isRight: false },
    ],
    level: 3,
  },

  // Televisão
  {
    title: 'Qual cantora brasileira interpretou o Hino Nacional na abertura da Copa do Mundo de 2014 ao lado de Pitbull e Jennifer Lopez?',
    correctAnswer: 1,
    answers: [
      { description: 'Paula Fernandes', isRight: false },
      { description: 'Claudia Leitte', isRight: true },
      { description: 'Ivete Sangalo', isRight: false },
      { description: 'Anitta', isRight: false },
    ],
    level: 2,
  },
  
      // Arquitetura
  {
    title: 'Qual é o nome do edifício icônico projetado por Oscar Niemeyer no centro de Belo Horizonte, famoso por suas curvas?',
    correctAnswer: 3,
    answers: [
      { description: 'Palácio da Alvorada', isRight: false },
      { description: 'Museu de Arte da Pampulha', isRight: false },
      { description: 'Igreja da Pampulha', isRight: false },
      { description: 'Edifício Copan (Edifício JK em BH)', isRight: true },
    ],
    level: 3,
  },

  // Música Brasileira
  {
    title: 'Qual é o compositor brasileiro conhecido por “Carinhoso”, um dos choros mais famosos do país?',
    correctAnswer: 0,
    answers: [
      { description: 'Pixinguinha', isRight: true },
      { description: 'Ernesto Nazareth', isRight: false },
      { description: 'Jacob do Bandolim', isRight: false },
      { description: 'Cartola', isRight: false },
    ],
    level: 2,
  },

  // Cultura Popular
  {
    title: 'Qual estado brasileiro é conhecido pela Festa do Peão de Barretos?',
    correctAnswer: 1,
    answers: [
      { description: 'Minas Gerais', isRight: false },
      { description: 'São Paulo', isRight: true },
      { description: 'Goiás', isRight: false },
      { description: 'Mato Grosso do Sul', isRight: false },
    ],
    level: 1,
  },

  // Música Brasileira
  {
    title: 'Quem foi a cantora brasileira que consagrou o samba-enredo “A Deusa dos Orixás”, conhecida como a “Voz de Ouro do Samba”?',
    correctAnswer: 2,
    answers: [
      { description: 'Alcione', isRight: false },
      { description: 'Beth Carvalho', isRight: false },
      { description: 'Clara Nunes', isRight: true },
      { description: 'Dona Ivone Lara', isRight: false },
    ],
    level: 2,
  },

  // Esportes
  {
    title: 'Qual jogador de futebol brasileiro ficou conhecido como “O Rei do Futebol”?',
    correctAnswer: 3,
    answers: [
      { description: 'Romário', isRight: false },
      { description: 'Zico', isRight: false },
      { description: 'Ronaldo Fenômeno', isRight: false },
      { description: 'Pelé', isRight: true },
    ],
    level: 1,
  },

  // Cultura Brasileira
  {
    title: 'Qual festa tradicional da cultura afro-brasileira ocorre no Recôncavo Baiano, em Cachoeira e São Félix, celebrando Irmandades de Nossa Senhora da Boa Morte?',
    correctAnswer: 0,
    answers: [
      { description: 'Festa da Boa Morte', isRight: true },
      { description: 'Lavagem do Bonfim', isRight: false },
      { description: 'Festa de Iemanjá', isRight: false },
      { description: 'Bumba Meu Boi', isRight: false },
    ],
    level: 3,
  },

  // Literatura Brasileira
  {
    title: 'Qual autora brasileira escreveu “A Hora da Estrela”?',
    correctAnswer: 1,
    answers: [
      { description: 'Cecília Meireles', isRight: false },
      { description: 'Clarice Lispector', isRight: true },
      { description: 'Ligia Fagundes Telles', isRight: false },
      { description: 'Rachel de Queiroz', isRight: false },
    ],
    level: 2,
  },

  // Dança Tradicional
  {
    title: 'Qual é a dança típica do Rio Grande do Sul, presente na cultura dos gaúchos?',
    correctAnswer: 2,
    answers: [
      { description: 'Frevo', isRight: false },
      { description: 'Maracatu', isRight: false },
      { description: 'Chula', isRight: true },
      { description: 'Carimbó', isRight: false },
    ],
    level: 2,
  },

  // Televisão Brasileira
  {
    title: 'Qual série de TV infantil brasileira, criada pela TV Cultura, apresentou bonecos como o Garibaldo, inspirada na “Sesame Street”?',
    correctAnswer: 0,
    answers: [
      { description: 'Vila Sésamo', isRight: true },
      { description: 'Cocoricó', isRight: false },
      { description: 'Glub Glub', isRight: false },
      { description: 'Rá-Tim-Bum', isRight: false },
    ],
    level: 1,
  },

  // Música Popular Brasileira
  {
    title: 'Qual cantora brasileira famosa pela canção “O Canto da Cidade” ganhou destaque nos anos 1990?',
    correctAnswer: 3,
    answers: [
      { description: 'Daniela Mercury', isRight: true },
      { description: 'Ivete Sangalo', isRight: false },
      { description: 'Margareth Menezes', isRight: false },
      { description: 'Vanessa da Mata', isRight: false },
    ],
    level: 1,
  },

  // Literatura Brasileira
  {
    title: 'Qual escritor modernista brasileiro escreveu “Macunaíma”?',
    correctAnswer: 2,
    answers: [
      { description: 'Oswald de Andrade', isRight: false },
      { description: 'Manuel Bandeira', isRight: false },
      { description: 'Mário de Andrade', isRight: true },
      { description: 'Guimarães Rosa', isRight: false },
    ],
    level: 3,
  }, 

   // Música Brasileira
  {
    title: 'Qual instrumento musical de cordas, parecido com um cavaquinho, é fundamental na execução do choro e do samba?',
    correctAnswer: 0,
    answers: [
      { description: 'Cavaquinho', isRight: true },
      { description: 'Bandolim', isRight: false },
      { description: 'Viola caipira', isRight: false },
      { description: 'Violão de sete cordas', isRight: false },
    ],
    level: 2,
  },

  // Artes Plásticas
  {
    title: 'Qual pintora brasileira, nascida na Suíça, é conhecida por retratar cenas do folclore e do cotidiano nacional em telas coloridas e ingênuas?',
    correctAnswer: 1,
    answers: [
      { description: 'Anita Malfatti', isRight: false },
      { description: 'Tarsila do Amaral', isRight: true },
      { description: 'Cândido Portinari', isRight: false },
      { description: 'Fayga Ostrower', isRight: false },
    ],
    level: 3,
  },

  // Literatura Brasileira
  {
    title: 'Qual novela da Rede Globo, escrita por Benedito Ruy Barbosa, conta a saga da família Mezenga envolvida com a pecuária e o latifúndio?',
    correctAnswer: 0,
    answers: [
      { description: 'O Rei do Gado', isRight: true },
      { description: 'Pantanal', isRight: false },
      { description: 'Terra Nostra', isRight: false },
      { description: 'Renascer', isRight: false },
    ],
    level: 1,
  },

  // Cultura Brasileira
  {
    title: 'Qual é a capital cultural do frevo, conhecida por seu Carnaval de rua vibrante e o Galo da Madrugada?',
    correctAnswer: 0,
    answers: [
      { description: 'Recife', isRight: true },
      { description: 'Olinda', isRight: false },
      { description: 'Porto Seguro', isRight: false },
      { description: 'São Luís', isRight: false },
    ],
    level: 1,
  },

  // Música Brasileira
  {
    title: 'Qual cantor e compositor é conhecido como um dos fundadores da Tropicália, ao lado de Caetano Veloso, e compôs “Aquele Abraço”?',
    correctAnswer: 2,
    answers: [
      { description: 'Chico Buarque', isRight: false },
      { description: 'Tom Zé', isRight: false },
      { description: 'Gilberto Gil', isRight: true },
      { description: 'Jorge Ben Jor', isRight: false },
    ],
    level: 2,
  },

  // Culinária Brasileira
  {
    title: 'Qual fruta é amplamente utilizada na culinária baiana, servindo como base para o azeite de dendê?',
    correctAnswer: 1,
    answers: [
      { description: 'Coco', isRight: false },
      { description: 'Dendê (fruto da palma)', isRight: true },
      { description: 'Caju', isRight: false },
      { description: 'Buriti', isRight: false },
    ],
    level: 1,
  },

  // Esportes
  {
    title: 'Qual foi o jogador brasileiro que venceu três Copas do Mundo (1958, 1962, 1970)?',
    correctAnswer: 0,
    answers: [
      { description: 'Pelé', isRight: true },
      { description: 'Cafu', isRight: false },
      { description: 'Djalma Santos', isRight: false },
      { description: 'Carlos Alberto Torres', isRight: false },
    ],
    level: 2,
  },

  // Cultura Brasileira
  {
    title: 'Qual é a maior emissora de televisão do Brasil?',
    correctAnswer: 2,
    answers: [
      { description: 'SBT', isRight: false },
      { description: 'Record TV', isRight: false },
      { description: 'Rede Globo', isRight: true },
      { description: 'Band', isRight: false },
    ],
    level: 1,
  },

  // Dança Tradicional
  {
    title: 'Qual dança típica do Pará é acompanhada de ritmos contagiantes e é executada em círculo?',
    correctAnswer: 1,
    answers: [
      { description: 'Marujada', isRight: false },
      { description: 'Carimbó', isRight: true },
      { description: 'Cateretê', isRight: false },
      { description: 'Siriá', isRight: false },
    ],
    level: 1,
  },

  // Literatura Brasileira
  {
    title: 'Qual poeta brasileiro é autor do poema “No meio do caminho tinha uma pedra”?',
    correctAnswer: 3,
    answers: [
      { description: 'Vinicius de Moraes', isRight: false },
      { description: 'Manuel Bandeira', isRight: false },
      { description: 'Ferreira Gullar', isRight: false },
      { description: 'Carlos Drummond de Andrade', isRight: true },
    ],
    level: 2,
  },
    // Televisão Brasileira
    {
      title: 'Qual programa humorístico brasileiro apresentou a “Escolinha do Professor Raimundo”?',
      correctAnswer: 2,
      answers: [
        { description: 'A Praça é Nossa', isRight: false },
        { description: 'Zorra Total', isRight: false },
        { description: 'Chico Anysio Show', isRight: true },
        { description: 'Cassino do Chacrinha', isRight: false },
      ],
      level: 1,
    },
  
    // História do Brasil
    {
      title: 'Qual país colonizou o Brasil?',
      correctAnswer: 0,
      answers: [
        { description: 'Portugal', isRight: true },
        { description: 'Espanha', isRight: false },
        { description: 'Holanda', isRight: false },
        { description: 'Inglaterra', isRight: false },
      ],
      level: 1,
    },
  
    // Música Brasileira
    {
      title: 'Qual cantora brasileira é conhecida como a “Rainha da Sofrência” na música sertaneja?',
      correctAnswer: 3,
      answers: [
        { description: 'Paula Fernandes', isRight: false },
        { description: 'Marília Mendonça', isRight: false },
        { description: 'Maiara & Maraisa', isRight: false },
        { description: 'Marília Mendonça', isRight: true },
      ],
      level: 1,
    },
  
    // Esportes
    {
      title: 'Qual jogador brasileiro de Fórmula 1 foi tricampeão mundial?',
      correctAnswer: 1,
      answers: [
        { description: 'Nelson Piquet', isRight: false },
        { description: 'Ayrton Senna', isRight: true },
        { description: 'Emerson Fittipaldi', isRight: false },
        { description: 'Rubens Barrichello', isRight: false },
      ],
      level: 2,
    },
  
    // Cultura Popular
    {
      title: 'Qual a principal manifestação cultural do Boi-Bumbá em Parintins, no Amazonas?',
      correctAnswer: 2,
      answers: [
        { description: 'Cavalhada', isRight: false },
        { description: 'Congada', isRight: false },
        { description: 'Festival de Parintins', isRight: true },
        { description: 'Bumba-Meu-Boi do Maranhão', isRight: false },
      ],
      level: 1,
    },
  
    // Cinema Brasileiro
    {
      title: 'Qual filme brasileiro dirigido por Fernando Meirelles ganhou projeção internacional ao mostrar a realidade de uma comunidade no Rio de Janeiro?',
      correctAnswer: 0,
      answers: [
        { description: 'Cidade de Deus', isRight: true },
        { description: 'Tropa de Elite', isRight: false },
        { description: 'Central do Brasil', isRight: false },
        { description: 'Carandiru', isRight: false },
      ],
      level: 2,
    },
  
    // Música Pop
    {
      title: 'Qual cantora brasileira é a voz marcante da música “A Lenda” e foi vocalista da banda “Rouge”?',
      correctAnswer: 1,
      answers: [
        { description: 'Ivete Sangalo', isRight: false },
        { description: 'Sandy', isRight: false },
        { description: 'Claudia Leitte', isRight: false },
        { description: 'Aline Wirley', isRight: true },
      ],
      level: 1,
    },
  
    // Turismo e Cultura
    {
      title: 'Qual faixa de areia no Rio de Janeiro ficou famosa mundialmente pela música “Garota de Ipanema”?',
      correctAnswer: 1,
      answers: [
        { description: 'Praia de Copacabana', isRight: false },
        { description: 'Praia de Ipanema', isRight: true },
        { description: 'Praia do Leblon', isRight: false },
        { description: 'Praia da Barra', isRight: false },
      ],
      level: 1,
    },
  
    // Literatura Brasileira
    {
      title: 'Qual escritor brasileiro criou a personagem Capitu, famosa pelo olhar enigmático, no romance “Dom Casmurro”?',
      correctAnswer: 0,
      answers: [
        { description: 'Machado de Assis', isRight: true },
        { description: 'José de Alencar', isRight: false },
        { description: 'Jorge Amado', isRight: false },
        { description: 'Lima Barreto', isRight: false },
      ],
      level: 2,
    },
  
    // Dança e Cultura Brasileira
    {
      title: 'Qual é a dança de salão tipicamente brasileira que surgiu no Rio de Janeiro e é dançada ao som do choro e do samba?',
      correctAnswer: 3,
      answers: [
        { description: 'Frevo', isRight: false },
        { description: 'Forró', isRight: false },
        { description: 'Carimbó', isRight: false },
        { description: 'Maxixe', isRight: true },
      ],
      level: 2,
    },
  
     // Esportes
  {
    title: 'Qual ex-tenista brasileiro foi número 1 do mundo e é carinhosamente chamado de “Guga”?',
    correctAnswer: 2,
    answers: [
      { description: 'Fernando Meligeni', isRight: false },
      { description: 'Thomaz Koch', isRight: false },
      { description: 'Gustavo Kuerten', isRight: true },
      { description: 'Jaime Oncins', isRight: false },
    ],
    level: 2,
  },

  // Televisão Brasileira
  {
    title: 'Qual atriz brasileira protagonizou a telenovela “Gabriela” (1975), baseada na obra de Jorge Amado?',
    correctAnswer: 1,
    answers: [
      { description: 'Glória Pires', isRight: false },
      { description: 'Sônia Braga', isRight: true },
      { description: 'Regina Duarte', isRight: false },
      { description: 'Susana Vieira', isRight: false },
    ],
    level: 2,
  },

  // Música Brasileira
  {
    title: 'Qual é o principal gênero musical tocado durante o Carnaval de Salvador, conduzido por trios elétricos?',
    correctAnswer: 2,
    answers: [
      { description: 'Samba', isRight: false },
      { description: 'Frevo', isRight: false },
      { description: 'Axé', isRight: true },
      { description: 'Maracatu', isRight: false },
    ],
    level: 1,
  },

  // Humor Brasileiro
  {
    title: 'Qual humorista brasileiro criou personagens como “Zé Bonitinho” e “Salomé”, e foi um ícone do humor televisivo?',
    correctAnswer: 1,
    answers: [
      { description: 'Costinha', isRight: false },
      { description: 'Chico Anysio', isRight: true },
      { description: 'Renato Aragão', isRight: false },
      { description: 'Jô Soares', isRight: false },
    ],
    level: 2,
  },

  // Esportes
  {
    title: 'De quanto em quanto tempo acontece uma Copa do Mundo?',
    correctAnswer: 3,
    answers: [
      { description: 'De dois em dois anos', isRight: false },
      { description: 'De oito em oito anos', isRight: false },
      { description: 'Ocorre todos os anos', isRight: false },
      { description: 'De quatro em quatro anos', isRight: true },
    ],
    level: 1,
  },

  // Matemática
  {
    title: 'Quantos meses do ano possuem 28 dias?',
    correctAnswer: 3,
    answers: [
      { description: 'Apenas um mês', isRight: false },
      { description: 'Seis meses', isRight: false },
      { description: 'Oito meses', isRight: false },
      { description: 'Doze meses', isRight: true },
    ],
    level: 1,
  },

  // Cultura Geral
  {
    title: 'Qual a cor que simboliza a esperança?',
    correctAnswer: 1,
    answers: [
      { description: 'Branco', isRight: false },
      { description: 'Verde', isRight: true },
      { description: 'Azul', isRight: false },
      { description: 'Vermelho', isRight: false },
    ],
    level: 1,
  },

  // Personalidades Brasileiras
  {
    title: 'Quais os dois primeiros nomes da apresentadora Xuxa?',
    correctAnswer: 2,
    answers: [
      { description: 'Maria de Lourdes', isRight: false },
      { description: 'Maria do Carmo', isRight: false },
      { description: 'Maria da Graça', isRight: true },
      { description: 'Maria Isabel', isRight: false },
    ],
    level: 1,
  },

  // História do Brasil
  {
    title: 'Qual o presidente brasileiro responsável pela construção de Brasília?',
    correctAnswer: 1,
    answers: [
      { description: 'Jânio Quadros', isRight: false },
      { description: 'Juscelino Kubitschek', isRight: true },
      { description: 'Getúlio Vargas', isRight: false },
      { description: 'Eurico Gaspar Dutra', isRight: false },
    ],
    level: 2,
  },

  // Ciência e Natureza
  {
    title: 'Como chamamos o sono do urso durante o inverno?',
    correctAnswer: 3,
    answers: [
      { description: 'Preguiça', isRight: false },
      { description: 'Demaio', isRight: false },
      { description: 'Cochilo', isRight: false },
      { description: 'Hibernação', isRight: true },
    ],
    level: 1,
  },

  // Cultura Popular
  {
    title: 'Segundo a lenda, em que fase da lua aparece o lobisomem?',
    correctAnswer: 1,
    answers: [
      { description: 'Nova', isRight: false },
      { description: 'Cheia', isRight: true },
      { description: 'Minguante', isRight: false },
      { description: 'Crescente', isRight: false },
    ],
    level: 1,
  },

  // Música Internacional
  {
    title: 'Em que ano foi morto John Lennon?',
    correctAnswer: 0,
    answers: [
      { description: '1980', isRight: true },
      { description: '1985', isRight: false },
      { description: '1981', isRight: false },
      { description: '1978', isRight: false },
    ],
    level: 2,
  },

  // Geografia Brasileira
  {
    title: 'Qual foi o último estado criado no Brasil?',
    correctAnswer: 0,
    answers: [
      { description: 'Tocantins', isRight: true },
      { description: 'Rondônia', isRight: false },
      { description: 'Acre', isRight: false },
      { description: 'Mato Grosso do Sul', isRight: false },
    ],
    level: 2,
  },

  // Futebol Brasileiro
  {
    title: 'Em qual dos clubes abaixo o jogador Yuri Alberto é ídolo?',
    correctAnswer: 1,
    answers: [
      { description: 'Santos', isRight: false },
      { description: 'Corinthians', isRight: true },
      { description: 'Bahia', isRight: false },
      { description: 'São Paulo', isRight: false },
    ],
    level: 1,
  },

  // História do Brasil
  {
    title: 'Em qual estado brasileiro ocorreu a guerra de Canudos?',
    correctAnswer: 1,
    answers: [
      { description: 'Sergipe', isRight: false },
      { description: 'Bahia', isRight: true },
      { description: 'São Paulo', isRight: false },
      { description: 'Rio de Janeiro', isRight: false },
    ],
    level: 2,
  },

  // Química
  {
    title: 'Qual o nome que se dá à mistura de água com sal?',
    correctAnswer: 1,
    answers: [
      { description: 'Gangorra', isRight: false },
      { description: 'Salmoura', isRight: true },
      { description: 'Melado', isRight: false },
      { description: 'Salada', isRight: false },
    ],
    level: 1,
  },

  // Ciências Naturais
  {
    title: 'De onde as abelhas extraem o mel?',
    correctAnswer: 1,
    answers: [
      { description: 'Rochas', isRight: false },
      { description: 'Flores', isRight: true },
      { description: 'Terra', isRight: false },
      { description: 'Água', isRight: false },
    ],
    level: 1,
  },

  ];

  constructor(private navController: NavController) {
    this.loadQuestionsFromStorage();
    this.currentLevel = 1;  // Garante o nível 1 no início de qualquer sessão
  }

  private loadQuestionsFromStorage(): void {
    const encryptedData = localStorage.getItem(STORAGE_KEY);
    if (encryptedData) {
      try {
        const bytes = CryptoJS.AES.decrypt(encryptedData, SECRET_KEY);
        const decryptedData = bytes.toString(CryptoJS.enc.Utf8);
        this.questions = JSON.parse(decryptedData);

        // Atualiza as perguntas adicionadas do conjunto original
        this.addedOriginalQuestions = new Set(
          this.questions
            .filter((q) => this.originalQuestions.some((oq) => oq.title === q.title))
            .map((q) => q.title)
        );
      } catch (error) {
        console.error('Erro ao carregar perguntas do Local Storage:', error);
        this.questions = [];
      }
    } else {
      this.questions = [];
    }
    this.addMissingOriginalQuestions();
  }

  private saveQuestionsToStorage(): void {
    try {
      const uniqueQuestions = this.questions.filter(
        (q, index, self) =>
          index === self.findIndex((t) => t.title === q.title)
      );
  
      const encryptedData = CryptoJS.AES.encrypt(
        JSON.stringify(uniqueQuestions),
        SECRET_KEY
      ).toString();
      localStorage.setItem(STORAGE_KEY, encryptedData);
    } catch (error) {
      console.error('Erro ao salvar perguntas:', error);
    }
  }
  

  private addMissingOriginalQuestions(): void {
    this.originalQuestions.forEach((question) => {
      if (!this.addedOriginalQuestions.has(question.title)) {
        this.questions.push(question);
        this.addedOriginalQuestions.add(question.title);
      }
    });
    this.saveQuestionsToStorage();
  }

  addQuestion(question: Question): void {
    this.questions.push(question);
    if (this.originalQuestions.some((q) => q.title === question.title)) {
      this.addedOriginalQuestions.add(question.title);
    }
    this.saveQuestionsToStorage();
  }

  deleteQuestion(index: number): void {
    if (index >= 0 && index < this.questions.length) {
      const deletedQuestion = this.questions[index];
      this.questions.splice(index, 1);
      if (this.originalQuestions.some((q) => q.title === deletedQuestion.title)) {
        this.addedOriginalQuestions.delete(deletedQuestion.title);
      }
      this.saveQuestionsToStorage();
    }
  }

  getAllQuestions(): Question[] {
    return this.questions;
  }

  getCurrentQuestion(): Question | null {
    if (this.questionCount < this.questions.length) {
      return this.questions[this.questionCount];
    }
    return null;
  }

  getNextQuestion(): Question {
    if (this.questionCount === 0) {
      this.currentLevel = 1;  // Garante que sempre comece no nível 1
    }
  
    // Filtrar perguntas ainda não respondidas do nível atual
    const availableQuestions = this.questions.filter(
      (q, index) => q.level === this.currentLevel && !this.usedQuestions.includes(index)
    );
  
    if (availableQuestions.length === 0) {
      console.warn('Nenhuma pergunta disponível para este nível. Resetando jogo.');
      this.resetGame(this.questions.length);  // Reinicia o jogo se não houver perguntas
      return this.getNextQuestion();
    }
  
    const randomIndex = Math.floor(Math.random() * availableQuestions.length);
    const nextQuestion = availableQuestions[randomIndex];
  
    // Adiciona o índice da pergunta usada
    this.usedQuestions.push(this.questions.indexOf(nextQuestion));
  
    this.questionCount++;
    console.log('Carregando pergunta:', nextQuestion);
    return nextQuestion;
  }
  
  

  answerQuestion(isCorrect: boolean): void {
    if (isCorrect) {
      this.consecutiveCorrectAnswers++;
    } else {
      this.consecutiveCorrectAnswers = 0;
    }

    if (this.consecutiveCorrectAnswers >= 3) {
      this.levelUp();
    }
  }

  private levelUp(): void {
    if (this.currentLevel < 3) {
      this.currentLevel++;
      console.log(`Parabéns! Você avançou para o nível ${this.currentLevel}`);
    }
    this.consecutiveCorrectAnswers = 0;
  }

  updateQuestion(index: number, updatedQuestion: Question): void {
    if (index >= 0 && index < this.questions.length) {
      this.questions[index] = updatedQuestion;
      this.saveQuestionsToStorage();
    }
  }
  
  resetGame(numeroQuestoes: number): void {
    this.questionCount = 0;
    this.usedQuestions = []; 
    this.currentLevel = 1;  
    
    this.questions = [...this.originalQuestions];
    this.shuffleQuestions();
    this.questions = this.questions.slice(0, numeroQuestoes);
    
    this.saveQuestionsToStorage();
    console.log('Estado do jogo reiniciado:', this.questions);
 }
 

  private shuffleQuestions(): void {
    this.questions.sort(() => 0.5 - Math.random());
  }

  setPrizeValues(totalPrize: number, numberOfQuestions: number): void {
    this.questionPrizes = [];
    const prizeIncrement = totalPrize / numberOfQuestions;
    for (let i = 1; i <= numberOfQuestions; i++) {
      const prizeForThisQuestion = prizeIncrement * i;
      this.questionPrizes.push(prizeForThisQuestion);
    }
  }

  getPrizeInfo(): { correctAnswer: number; wrongAnswer: number; quit: number } {
    if (this.questionCount <= 0 || this.questionCount > this.questionPrizes.length) {
      return { correctAnswer: 0, wrongAnswer: 0, quit: 0 };
    }
    const curQuestionPrize = this.questionPrizes[this.questionCount - 1] || 0;
    const prevQuestionPrize = this.questionPrizes[this.questionCount - 2] || 0;
    const prevPrevQuestionPrize = this.questionPrizes[this.questionCount - 3] || 0;

    return {
      correctAnswer: curQuestionPrize,
      wrongAnswer: this.questionCount <= 2 ? 0 : prevPrevQuestionPrize,
      quit: this.questionCount === 1 ? 0 : prevQuestionPrize,
    };
  }

  getCurrentLevel(): number {
    return this.currentLevel;
  }

  setLevel(level: number): void {
    if (level >= 1 && level <= 3) {
      this.currentLevel = level;
    }
  }
  
  getQuestionByIndex(index: number): Question | undefined {
    return this.questions[index];
  }
  

  exportQuestions(): void {
    if (!this.questions.length) {
      alert('Nenhuma pergunta disponível para exportar.');
      return;
    }

    const blob = new Blob([JSON.stringify(this.questions)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'questions.json';
    link.click();
  }

  importQuestions(file: File): void {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const importedQuestions = JSON.parse(reader.result as string);
        if (Array.isArray(importedQuestions) && importedQuestions.length === 0) {
          this.clearAllQuestions();
          alert('Todas as questões foram removidas.');
        } else if (Array.isArray(importedQuestions)) {
          this.questions = [...this.questions, ...importedQuestions];
          this.saveQuestionsToStorage();
          alert('Perguntas importadas com sucesso!');
        } else {
          throw new Error('Formato de arquivo inválido.');
        }
      } catch (e) {
        console.error('Erro ao importar perguntas:', e);
        alert('Erro ao importar perguntas. Verifique o formato do arquivo.');
      }
    };
    reader.readAsText(file);
  }

  clearAllQuestions(): void {
    this.questions = [];
    this.addedOriginalQuestions.clear();
    this.saveQuestionsToStorage();
  }

  

  voltarParaMenu(navController: NavController): void {
    this.clearAllQuestions();
    navController.navigateRoot('/menu');
}

iniciarNovoJogo() {
  this.resetGame(this.getAllQuestions().length);  // Passa o número correto de perguntas
  this.navController.navigateRoot('/question');
}


loadQuestions() {
  this.questions = [];
  this.loadQuestionsFromStorage();
  this.currentQuestionIndex = 0;
}



ionViewWillEnter() {
  const totalQuestions = this.getAllQuestions().length;
  if (totalQuestions > 0) {
     this.resetGame(totalQuestions);
  }
  this.loadQuestionsFromStorage();
}

}

