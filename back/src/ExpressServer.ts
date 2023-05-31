import express from 'express'
import http from 'http'
export abstract class ExpressServer {
    abstract getApp(): express.Express
    abstract getServer(): http.Server | null
    abstract listen(callback: (port: number) => void): void
}