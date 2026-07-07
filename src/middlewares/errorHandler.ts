import { Request, Response, NextFunction } from "express";

type ErrorWithDetails = Error & {
  code?: string;
  status?: number;
  statusCode?: number;
  meta?: Record<string, unknown>;
  type?: string;
};

type PublicError = {
  statusCode: number;
  message: string;
  code?: string;
  details?: string[];
};

const prismaModelTableMap: Record<string, string> = {
  Account: "account",
  ContactSubmission: "contact_submissions",
  Like: "likes",
  Newsletter: "newsletters",
  Portfolio: "portfolios",
  Post: "posts",
  Session: "session",
  User: "user",
  Verification: "verification",
};

const addDetail = (details: string[], label: string, value: unknown) => {
  if (typeof value === "string" && value.trim()) {
    details.push(`${label}: ${value}`);
  } else if (Array.isArray(value) && value.length) {
    details.push(`${label}: ${value.join(", ")}`);
  }
};

const getPrismaError = (err: ErrorWithDetails): PublicError | null => {
  if (!err.code || !/^P\d{4}$/.test(err.code)) {
    return null;
  }

  const details: string[] = [];
  addDetail(details, "Target", err.meta?.target);
  addDetail(details, "Table", err.meta?.table);
  addDetail(details, "Column", err.meta?.column);
  addDetail(details, "Model", err.meta?.modelName);

  const modelName = typeof err.meta?.modelName === "string" ? err.meta.modelName : undefined;
  const mappedTable = modelName ? prismaModelTableMap[modelName] : undefined;
  const table = typeof err.meta?.table === "string" ? err.meta.table : mappedTable ?? "the requested table";
  const column = typeof err.meta?.column === "string" ? err.meta.column : "a required column";
  const target = Array.isArray(err.meta?.target)
    ? err.meta.target.join(", ")
    : typeof err.meta?.target === "string"
      ? err.meta.target
      : "a unique field";

  const prismaErrors: Record<string, PublicError> = {
    P1000: {
      statusCode: 500,
      message: "Database authentication failed. Check the database username and password.",
    },
    P1001: {
      statusCode: 503,
      message: "The backend cannot reach the database server. Check DATABASE_URL and database availability.",
    },
    P1002: {
      statusCode: 503,
      message: "The database connection timed out. Try again or check the database server.",
    },
    P1003: {
      statusCode: 500,
      message: "The configured database does not exist. Check DATABASE_URL.",
    },
    P1010: {
      statusCode: 500,
      message: "The database user does not have permission to access the database.",
    },
    P1017: {
      statusCode: 503,
      message: "The database server closed the connection.",
    },
    P2000: {
      statusCode: 400,
      message: "One of the submitted values is too long for the database field.",
    },
    P2001: {
      statusCode: 404,
      message: "The requested record was not found.",
    },
    P2002: {
      statusCode: 409,
      message: `A record already exists with the same value for ${target}.`,
    },
    P2003: {
      statusCode: 400,
      message: "This record cannot be saved because a related record is missing.",
    },
    P2011: {
      statusCode: 400,
      message: "A required database field received a null value.",
    },
    P2012: {
      statusCode: 400,
      message: "A required value is missing.",
    },
    P2013: {
      statusCode: 400,
      message: "A required argument is missing from the database query.",
    },
    P2014: {
      statusCode: 400,
      message: "This change would break a required relationship between records.",
    },
    P2021: {
      statusCode: 500,
      message: `Database table "${table}" does not exist. Run the latest Prisma migration against the current database.`,
    },
    P2022: {
      statusCode: 500,
      message: `Database column "${column}" does not exist. Run the latest Prisma migration against the current database.`,
    },
    P2024: {
      statusCode: 503,
      message: "The database connection pool timed out. Try again later.",
    },
    P2025: {
      statusCode: 404,
      message: "The record you are trying to read, update, or delete does not exist.",
    },
  };

  const mappedError = prismaErrors[err.code] ?? {
    statusCode: 500,
    message: "A database operation failed.",
  };

  return {
    ...mappedError,
    code: err.code,
    ...(details.length ? { details } : {}),
  };
};

const getPublicError = (err: ErrorWithDetails): PublicError => {
  const prismaError = getPrismaError(err);

  if (prismaError) {
    return prismaError;
  }

  if (err instanceof SyntaxError && err.type === "entity.parse.failed") {
    return {
      statusCode: 400,
      message: "Invalid JSON body. Check the request payload syntax.",
    };
  }

  const statusCode = err.statusCode ?? err.status ?? 500;
  const isServerError = statusCode >= 500;

  return {
    statusCode,
    message: isServerError ? "Internal Server Error" : err.message || "Request failed.",
  };
};

const errorHandler = (err: ErrorWithDetails, req: Request, res: Response, next: NextFunction) => {
  console.error(err);

  const publicError = getPublicError(err);

  const errorResponse: Record<string, unknown> = {
    success: false,
    statusCode: publicError.statusCode,
    error: publicError.message,
  };

  if (publicError.code) {
    errorResponse.code = publicError.code;
  }

  if (publicError.details?.length) {
    errorResponse.details = publicError.details;
  }

  res.status(publicError.statusCode).json(errorResponse);
};

export default errorHandler;
