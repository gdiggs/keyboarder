import type { NextApiRequest, NextApiResponse } from 'next'
import { base } from "../../utils/Airtable";
import { Keyboard } from "../../utils/interfaces";

const collection = require('lodash/collection');

interface Photo {
  url: string;
}

const getPhotoURL = function(photoField?: Photo[]): string | undefined {
  if (photoField !== undefined) {
    return photoField[0].url;
  } else {
    return undefined;
  }
};

const getAssociationName = async function(table: string, id: string): Promise<string> {
  return (await base(table).find(id)).fields.Name;
}

const getKeycaps = async function(id: string): Promise<string> {
  return getAssociationName("Keycaps", id);
}

const getSwitches = async function(id: string): Promise<string> {
  return getAssociationName("Switches", id);
}

const getKeyboard = async function (): Promise<Keyboard> {
  const keyboards = await base("Builds").select({
    fields: ["Name", "Switches", "Layout", "Keycaps", "Photo"],
    filterByFormula: "AND(Status = 'Built', Layout != 'Macropad')"
  }).firstPage();

  const board = collection.sample(keyboards);

  return {
    keycaps: await getKeycaps(board.fields.Keycaps[0]),
    layout: board.fields.Layout,
    name: board.fields.Name,
    photo_url: getPhotoURL(board.fields.Photo),
    switches: await getSwitches(board.fields.Switches[0]),
  };
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Keyboard>
) {
  res.status(200).json(await getKeyboard());
}
