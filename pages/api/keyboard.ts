import { base } from "../../utils/Airtable";

const collection = require('lodash/collection');

interface Keyboard {
  keycaps: string;
  layout: string;
  name: string;
  photo_url?: string;
  switches: string;
}

const getPhotoURL = function(photoField?: Object): string | null {
  if (photoField !== undefined) {
    return photoField[0].url;
  } else {
    return null;
  }
};

const getAssociationName = async function(table: string, id: string): Object {
  return (await base(table).find(id)).fields.Name;
}

const getKeycaps = async function(id: string): string {
  return getAssociationName("Keycaps", id);
}

const getSwitches = async function(id: string): string {
  return getAssociationName("Switches", id);
}

const getKeyboard = async function (): Keyboard {
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
  res: NextApiResponse<Data>
) {
  res.status(200).json(await getKeyboard());
}
