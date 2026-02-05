import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpException,
    HttpStatus,
    Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
    private readonly logger = new Logger(GlobalExceptionFilter.name);

    catch(exception: unknown, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();

        let status = HttpStatus.INTERNAL_SERVER_ERROR;
        let message = 'Internal server error';
        let errorCode = 'INTERNAL_ERROR';
        let errors = null;

        if (exception instanceof HttpException) {
            status = exception.getStatus();
            const responseBody = exception.getResponse();

            if (typeof responseBody === 'string') {
                message = responseBody;
            } else if (typeof responseBody === 'object') {
                const body = responseBody as any;
                message = body.message || message;
                errorCode = body.error || 'HTTP_ERROR';
                if (Array.isArray(body.message)) {
                    errors = body.message; // Class validator errors
                    message = 'Validation failed';
                }
            }
        } else if (exception instanceof Error) {
            message = exception.message;
            // In production, you might not want to expose stack traces or raw DB errors
        }

        this.logger.error(
            `${request.method} ${request.url} - ${status} - ${message}`,
            exception instanceof Error ? exception.stack : '',
        );

        response.status(status).json({
            success: false,
            message,
            errorCode,
            errors,
            timestamp: new Date().toISOString(),
            path: request.url,
        });
    }
}
