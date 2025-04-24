import express from 'express';
import jwt from 'jsonwebtoken';

export const validateRequest = (req, res, next) => {
    next();
};

export const authenticateUser = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({ message: 'Token não fornecido.' });
    }

    const token = authHeader.split(' ')[1]; // O formato esperado é "Bearer <token>"

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Adiciona os dados do usuário ao objeto `req`
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Token inválido ou expirado.' });
    }
};

export const logRequest = (req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
};
