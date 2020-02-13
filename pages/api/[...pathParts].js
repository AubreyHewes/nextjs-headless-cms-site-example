// import { NextApiRequest, NextApiResponse } from "next";

const data = {
  page: [
    {
      id: 1,
      slug: "",
      title: "Home",
      content: "controller:home"
    },
    {
      id: 2,
      slug: "event",
      title: "Events",
      content: "controller:event"
    },
    {
      id: 3,
      slug: "evenementen",
      title: "Events redirect",
      content: "/event"
    },
    {
      id: 4,
      slug: "about",
      title: "About",
      content: "This is us"
    }
  ],
  event: [
    {
      id: 1,
      title: "test",
      content: "yo"
    }
  ]
};

const findData = query => {
  const [type, id] = query.pathParts;
  if (!data[type]) {
    return null;
  }
  if (!id) {
    if (type === "page") {
      if (query.slug) {
        return data[type].find(p => p.slug === query.slug);
      }
      return [
        ...data[type].map(p => ({
          ...p,
          content: undefined
        }))
      ];
    }
    return data[type];
  }
  let itemId = id;
  if (!isNaN(itemId)) {
    itemId = parseInt(itemId);
  }
  return data[type].find(item => item.id === itemId);
};

export default (req, res) => {
  console.log(req.query);
  const data = findData(req.query);

  if (data === null) {
    res.status(501).json({ status: 501, message: "Not implemented" });
    return;
  }

  if (data === undefined) {
    res.status(404).json({ status: 404, message: "Not found" });
    return;
  }

  res.json(data);
};
