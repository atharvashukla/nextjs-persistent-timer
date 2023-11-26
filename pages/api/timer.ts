import type { NextApiRequest, NextApiResponse } from "next";

type ResponseData = {
  duration: number;
  ttl: number;
  expiry: number;
};

export default function handler(
  _req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  res
    .status(200)
    .json({ duration: 5 * 1000, ttl: 2 * 1000, expiry: 10 * 1000 });
}
