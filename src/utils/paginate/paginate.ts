import { Schema, Document, Model } from "mongoose";

export interface QueryResult {
  results: Document[];
  page: number;
  limit: number;
  totalPages: number;
  totalResult: number;
}

export interface IOptions {
  sortBy?: string;
  projectBy?: string;
  populate?: string;
  limit?: string;
  page?: string;
}

const paginate = <T extends Document, U extends Model<U>>(
  schema: Schema<T>
): void => {
  schema.static(
    "paginate",
    async function (
      filter: Record<string, any>,
      options: IOptions
    ): Promise<QueryResult> {
      let sort: string = "";
      if (options.sortBy) {
        const sortingCriteria: any = [];
        options.sortBy.split(",").forEach((sortOption: string) => {
          const [key, order] = sortOption.split(":");
          sortingCriteria.push((order === "desc" ? "-" : "") + key);
        });
        sort = sortingCriteria.join(" ");
      } else {
        sort = "createdAt";
      }

      let project: string = "";
      if (options.projectBy) {
        const projectionCriteria: any = [];
        options.projectBy.split(",").forEach((projectOption: string) => {
          const [key, include] = projectOption.split(":");
          projectionCriteria.push((include === "hide" ? "-" : "") + key);
        });
        project = projectionCriteria.join(" ");
      } else {
        project = "-createdAt -updatedAt";
      }

      const limit =
        options.limit && parseInt(options.limit.toString(), 10) > 0
          ? parseInt(options.limit.toString(), 10)
          : 10;
      const page =
        options.page && parseInt(options.page.toString(), 10) > 0
          ? parseInt(options.page.toString(), 10)
          : 1;
      const skip = (page - 1) * limit;

      const countPromise = this.countDocuments(filter).exec();
      let docPromise = this.find(filter)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .select(project);

      if (options.populate) {
        options.populate.split(",").forEach((populateOptions: any) => {
          docPromise = docPromise.populate(
            populateOptions
              .split(".")
              .reverse()
              .reduce((a: string, b: string) => ({
                path: b,
                populate: a,
              }))
          );
        });
      }
      docPromise = docPromise.exec();

      return Promise.all([countPromise, docPromise]).then((values) => {
        const [totalResult, results] = values;
        const totalPages = Math.ceil(totalResult / limit);
        const result = {
          results,
          page,
          limit,
          totalPages,
          totalResult,
        };
        return Promise.resolve(result);
      });
    }
  );
};

export default paginate;
