import * as express from "express";

declare global {
  namespace Express {
    interface Request {
      isText?: boolean; // Add the isText property
      mimetype?: string;
      bucketURL?: string;
      uuid?: string;
    }
  }
}
