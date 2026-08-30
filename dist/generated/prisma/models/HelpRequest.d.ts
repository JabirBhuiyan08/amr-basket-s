import type * as runtime from "@prisma/client/runtime/client";
import type * as $Enums from "../enums";
import type * as Prisma from "../internal/prismaNamespace";
/**
 * Model HelpRequest
 *
 */
export type HelpRequestModel = runtime.Types.Result.DefaultSelection<Prisma.$HelpRequestPayload>;
export type AggregateHelpRequest = {
    _count: HelpRequestCountAggregateOutputType | null;
    _min: HelpRequestMinAggregateOutputType | null;
    _max: HelpRequestMaxAggregateOutputType | null;
};
export type HelpRequestMinAggregateOutputType = {
    id: string | null;
    userId: string | null;
    subject: string | null;
    message: string | null;
    phoneNumber: string | null;
    status: $Enums.HelpStatus | null;
    assignedTo: string | null;
    resolvedAt: Date | null;
    createdAt: Date | null;
    updatedAt: Date | null;
};
export type HelpRequestMaxAggregateOutputType = {
    id: string | null;
    userId: string | null;
    subject: string | null;
    message: string | null;
    phoneNumber: string | null;
    status: $Enums.HelpStatus | null;
    assignedTo: string | null;
    resolvedAt: Date | null;
    createdAt: Date | null;
    updatedAt: Date | null;
};
export type HelpRequestCountAggregateOutputType = {
    id: number;
    userId: number;
    subject: number;
    message: number;
    phoneNumber: number;
    status: number;
    assignedTo: number;
    resolvedAt: number;
    createdAt: number;
    updatedAt: number;
    _all: number;
};
export type HelpRequestMinAggregateInputType = {
    id?: true;
    userId?: true;
    subject?: true;
    message?: true;
    phoneNumber?: true;
    status?: true;
    assignedTo?: true;
    resolvedAt?: true;
    createdAt?: true;
    updatedAt?: true;
};
export type HelpRequestMaxAggregateInputType = {
    id?: true;
    userId?: true;
    subject?: true;
    message?: true;
    phoneNumber?: true;
    status?: true;
    assignedTo?: true;
    resolvedAt?: true;
    createdAt?: true;
    updatedAt?: true;
};
export type HelpRequestCountAggregateInputType = {
    id?: true;
    userId?: true;
    subject?: true;
    message?: true;
    phoneNumber?: true;
    status?: true;
    assignedTo?: true;
    resolvedAt?: true;
    createdAt?: true;
    updatedAt?: true;
    _all?: true;
};
export type HelpRequestAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Filter which HelpRequest to aggregate.
     */
    where?: Prisma.HelpRequestWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of HelpRequests to fetch.
     */
    orderBy?: Prisma.HelpRequestOrderByWithRelationInput | Prisma.HelpRequestOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the start position
     */
    cursor?: Prisma.HelpRequestWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` HelpRequests from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` HelpRequests.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Count returned HelpRequests
    **/
    _count?: true | HelpRequestCountAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the minimum value
    **/
    _min?: HelpRequestMinAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the maximum value
    **/
    _max?: HelpRequestMaxAggregateInputType;
};
export type GetHelpRequestAggregateType<T extends HelpRequestAggregateArgs> = {
    [P in keyof T & keyof AggregateHelpRequest]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateHelpRequest[P]> : Prisma.GetScalarType<T[P], AggregateHelpRequest[P]>;
};
export type HelpRequestGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.HelpRequestWhereInput;
    orderBy?: Prisma.HelpRequestOrderByWithAggregationInput | Prisma.HelpRequestOrderByWithAggregationInput[];
    by: Prisma.HelpRequestScalarFieldEnum[] | Prisma.HelpRequestScalarFieldEnum;
    having?: Prisma.HelpRequestScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: HelpRequestCountAggregateInputType | true;
    _min?: HelpRequestMinAggregateInputType;
    _max?: HelpRequestMaxAggregateInputType;
};
export type HelpRequestGroupByOutputType = {
    id: string;
    userId: string | null;
    subject: string;
    message: string;
    phoneNumber: string | null;
    status: $Enums.HelpStatus;
    assignedTo: string | null;
    resolvedAt: Date | null;
    createdAt: Date;
    updatedAt: Date;
    _count: HelpRequestCountAggregateOutputType | null;
    _min: HelpRequestMinAggregateOutputType | null;
    _max: HelpRequestMaxAggregateOutputType | null;
};
export type GetHelpRequestGroupByPayload<T extends HelpRequestGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<HelpRequestGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof HelpRequestGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], HelpRequestGroupByOutputType[P]> : Prisma.GetScalarType<T[P], HelpRequestGroupByOutputType[P]>;
}>>;
export type HelpRequestWhereInput = {
    AND?: Prisma.HelpRequestWhereInput | Prisma.HelpRequestWhereInput[];
    OR?: Prisma.HelpRequestWhereInput[];
    NOT?: Prisma.HelpRequestWhereInput | Prisma.HelpRequestWhereInput[];
    id?: Prisma.StringFilter<"HelpRequest"> | string;
    userId?: Prisma.StringNullableFilter<"HelpRequest"> | string | null;
    subject?: Prisma.StringFilter<"HelpRequest"> | string;
    message?: Prisma.StringFilter<"HelpRequest"> | string;
    phoneNumber?: Prisma.StringNullableFilter<"HelpRequest"> | string | null;
    status?: Prisma.EnumHelpStatusFilter<"HelpRequest"> | $Enums.HelpStatus;
    assignedTo?: Prisma.StringNullableFilter<"HelpRequest"> | string | null;
    resolvedAt?: Prisma.DateTimeNullableFilter<"HelpRequest"> | Date | string | null;
    createdAt?: Prisma.DateTimeFilter<"HelpRequest"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"HelpRequest"> | Date | string;
};
export type HelpRequestOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    userId?: Prisma.SortOrderInput | Prisma.SortOrder;
    subject?: Prisma.SortOrder;
    message?: Prisma.SortOrder;
    phoneNumber?: Prisma.SortOrderInput | Prisma.SortOrder;
    status?: Prisma.SortOrder;
    assignedTo?: Prisma.SortOrderInput | Prisma.SortOrder;
    resolvedAt?: Prisma.SortOrderInput | Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type HelpRequestWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    AND?: Prisma.HelpRequestWhereInput | Prisma.HelpRequestWhereInput[];
    OR?: Prisma.HelpRequestWhereInput[];
    NOT?: Prisma.HelpRequestWhereInput | Prisma.HelpRequestWhereInput[];
    userId?: Prisma.StringNullableFilter<"HelpRequest"> | string | null;
    subject?: Prisma.StringFilter<"HelpRequest"> | string;
    message?: Prisma.StringFilter<"HelpRequest"> | string;
    phoneNumber?: Prisma.StringNullableFilter<"HelpRequest"> | string | null;
    status?: Prisma.EnumHelpStatusFilter<"HelpRequest"> | $Enums.HelpStatus;
    assignedTo?: Prisma.StringNullableFilter<"HelpRequest"> | string | null;
    resolvedAt?: Prisma.DateTimeNullableFilter<"HelpRequest"> | Date | string | null;
    createdAt?: Prisma.DateTimeFilter<"HelpRequest"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"HelpRequest"> | Date | string;
}, "id">;
export type HelpRequestOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    userId?: Prisma.SortOrderInput | Prisma.SortOrder;
    subject?: Prisma.SortOrder;
    message?: Prisma.SortOrder;
    phoneNumber?: Prisma.SortOrderInput | Prisma.SortOrder;
    status?: Prisma.SortOrder;
    assignedTo?: Prisma.SortOrderInput | Prisma.SortOrder;
    resolvedAt?: Prisma.SortOrderInput | Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    _count?: Prisma.HelpRequestCountOrderByAggregateInput;
    _max?: Prisma.HelpRequestMaxOrderByAggregateInput;
    _min?: Prisma.HelpRequestMinOrderByAggregateInput;
};
export type HelpRequestScalarWhereWithAggregatesInput = {
    AND?: Prisma.HelpRequestScalarWhereWithAggregatesInput | Prisma.HelpRequestScalarWhereWithAggregatesInput[];
    OR?: Prisma.HelpRequestScalarWhereWithAggregatesInput[];
    NOT?: Prisma.HelpRequestScalarWhereWithAggregatesInput | Prisma.HelpRequestScalarWhereWithAggregatesInput[];
    id?: Prisma.StringWithAggregatesFilter<"HelpRequest"> | string;
    userId?: Prisma.StringNullableWithAggregatesFilter<"HelpRequest"> | string | null;
    subject?: Prisma.StringWithAggregatesFilter<"HelpRequest"> | string;
    message?: Prisma.StringWithAggregatesFilter<"HelpRequest"> | string;
    phoneNumber?: Prisma.StringNullableWithAggregatesFilter<"HelpRequest"> | string | null;
    status?: Prisma.EnumHelpStatusWithAggregatesFilter<"HelpRequest"> | $Enums.HelpStatus;
    assignedTo?: Prisma.StringNullableWithAggregatesFilter<"HelpRequest"> | string | null;
    resolvedAt?: Prisma.DateTimeNullableWithAggregatesFilter<"HelpRequest"> | Date | string | null;
    createdAt?: Prisma.DateTimeWithAggregatesFilter<"HelpRequest"> | Date | string;
    updatedAt?: Prisma.DateTimeWithAggregatesFilter<"HelpRequest"> | Date | string;
};
export type HelpRequestCreateInput = {
    id?: string;
    userId?: string | null;
    subject: string;
    message: string;
    phoneNumber?: string | null;
    status?: $Enums.HelpStatus;
    assignedTo?: string | null;
    resolvedAt?: Date | string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type HelpRequestUncheckedCreateInput = {
    id?: string;
    userId?: string | null;
    subject: string;
    message: string;
    phoneNumber?: string | null;
    status?: $Enums.HelpStatus;
    assignedTo?: string | null;
    resolvedAt?: Date | string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type HelpRequestUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    userId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    subject?: Prisma.StringFieldUpdateOperationsInput | string;
    message?: Prisma.StringFieldUpdateOperationsInput | string;
    phoneNumber?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    status?: Prisma.EnumHelpStatusFieldUpdateOperationsInput | $Enums.HelpStatus;
    assignedTo?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    resolvedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type HelpRequestUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    userId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    subject?: Prisma.StringFieldUpdateOperationsInput | string;
    message?: Prisma.StringFieldUpdateOperationsInput | string;
    phoneNumber?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    status?: Prisma.EnumHelpStatusFieldUpdateOperationsInput | $Enums.HelpStatus;
    assignedTo?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    resolvedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type HelpRequestCreateManyInput = {
    id?: string;
    userId?: string | null;
    subject: string;
    message: string;
    phoneNumber?: string | null;
    status?: $Enums.HelpStatus;
    assignedTo?: string | null;
    resolvedAt?: Date | string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type HelpRequestUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    userId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    subject?: Prisma.StringFieldUpdateOperationsInput | string;
    message?: Prisma.StringFieldUpdateOperationsInput | string;
    phoneNumber?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    status?: Prisma.EnumHelpStatusFieldUpdateOperationsInput | $Enums.HelpStatus;
    assignedTo?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    resolvedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type HelpRequestUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    userId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    subject?: Prisma.StringFieldUpdateOperationsInput | string;
    message?: Prisma.StringFieldUpdateOperationsInput | string;
    phoneNumber?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    status?: Prisma.EnumHelpStatusFieldUpdateOperationsInput | $Enums.HelpStatus;
    assignedTo?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    resolvedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type HelpRequestCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    subject?: Prisma.SortOrder;
    message?: Prisma.SortOrder;
    phoneNumber?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    assignedTo?: Prisma.SortOrder;
    resolvedAt?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type HelpRequestMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    subject?: Prisma.SortOrder;
    message?: Prisma.SortOrder;
    phoneNumber?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    assignedTo?: Prisma.SortOrder;
    resolvedAt?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type HelpRequestMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    subject?: Prisma.SortOrder;
    message?: Prisma.SortOrder;
    phoneNumber?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    assignedTo?: Prisma.SortOrder;
    resolvedAt?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type EnumHelpStatusFieldUpdateOperationsInput = {
    set?: $Enums.HelpStatus;
};
export type HelpRequestSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    userId?: boolean;
    subject?: boolean;
    message?: boolean;
    phoneNumber?: boolean;
    status?: boolean;
    assignedTo?: boolean;
    resolvedAt?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
}, ExtArgs["result"]["helpRequest"]>;
export type HelpRequestSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    userId?: boolean;
    subject?: boolean;
    message?: boolean;
    phoneNumber?: boolean;
    status?: boolean;
    assignedTo?: boolean;
    resolvedAt?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
}, ExtArgs["result"]["helpRequest"]>;
export type HelpRequestSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    userId?: boolean;
    subject?: boolean;
    message?: boolean;
    phoneNumber?: boolean;
    status?: boolean;
    assignedTo?: boolean;
    resolvedAt?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
}, ExtArgs["result"]["helpRequest"]>;
export type HelpRequestSelectScalar = {
    id?: boolean;
    userId?: boolean;
    subject?: boolean;
    message?: boolean;
    phoneNumber?: boolean;
    status?: boolean;
    assignedTo?: boolean;
    resolvedAt?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
};
export type HelpRequestOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "userId" | "subject" | "message" | "phoneNumber" | "status" | "assignedTo" | "resolvedAt" | "createdAt" | "updatedAt", ExtArgs["result"]["helpRequest"]>;
export type $HelpRequestPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "HelpRequest";
    objects: {};
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        userId: string | null;
        subject: string;
        message: string;
        phoneNumber: string | null;
        status: $Enums.HelpStatus;
        assignedTo: string | null;
        resolvedAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
    }, ExtArgs["result"]["helpRequest"]>;
    composites: {};
};
export type HelpRequestGetPayload<S extends boolean | null | undefined | HelpRequestDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$HelpRequestPayload, S>;
export type HelpRequestCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<HelpRequestFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: HelpRequestCountAggregateInputType | true;
};
export interface HelpRequestDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['HelpRequest'];
        meta: {
            name: 'HelpRequest';
        };
    };
    /**
     * Find zero or one HelpRequest that matches the filter.
     * @param {HelpRequestFindUniqueArgs} args - Arguments to find a HelpRequest
     * @example
     * // Get one HelpRequest
     * const helpRequest = await prisma.helpRequest.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends HelpRequestFindUniqueArgs>(args: Prisma.SelectSubset<T, HelpRequestFindUniqueArgs<ExtArgs>>): Prisma.Prisma__HelpRequestClient<runtime.Types.Result.GetResult<Prisma.$HelpRequestPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    /**
     * Find one HelpRequest that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {HelpRequestFindUniqueOrThrowArgs} args - Arguments to find a HelpRequest
     * @example
     * // Get one HelpRequest
     * const helpRequest = await prisma.helpRequest.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends HelpRequestFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, HelpRequestFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__HelpRequestClient<runtime.Types.Result.GetResult<Prisma.$HelpRequestPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Find the first HelpRequest that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {HelpRequestFindFirstArgs} args - Arguments to find a HelpRequest
     * @example
     * // Get one HelpRequest
     * const helpRequest = await prisma.helpRequest.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends HelpRequestFindFirstArgs>(args?: Prisma.SelectSubset<T, HelpRequestFindFirstArgs<ExtArgs>>): Prisma.Prisma__HelpRequestClient<runtime.Types.Result.GetResult<Prisma.$HelpRequestPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    /**
     * Find the first HelpRequest that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {HelpRequestFindFirstOrThrowArgs} args - Arguments to find a HelpRequest
     * @example
     * // Get one HelpRequest
     * const helpRequest = await prisma.helpRequest.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends HelpRequestFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, HelpRequestFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__HelpRequestClient<runtime.Types.Result.GetResult<Prisma.$HelpRequestPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Find zero or more HelpRequests that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {HelpRequestFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all HelpRequests
     * const helpRequests = await prisma.helpRequest.findMany()
     *
     * // Get first 10 HelpRequests
     * const helpRequests = await prisma.helpRequest.findMany({ take: 10 })
     *
     * // Only select the `id`
     * const helpRequestWithIdOnly = await prisma.helpRequest.findMany({ select: { id: true } })
     *
     */
    findMany<T extends HelpRequestFindManyArgs>(args?: Prisma.SelectSubset<T, HelpRequestFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$HelpRequestPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    /**
     * Create a HelpRequest.
     * @param {HelpRequestCreateArgs} args - Arguments to create a HelpRequest.
     * @example
     * // Create one HelpRequest
     * const HelpRequest = await prisma.helpRequest.create({
     *   data: {
     *     // ... data to create a HelpRequest
     *   }
     * })
     *
     */
    create<T extends HelpRequestCreateArgs>(args: Prisma.SelectSubset<T, HelpRequestCreateArgs<ExtArgs>>): Prisma.Prisma__HelpRequestClient<runtime.Types.Result.GetResult<Prisma.$HelpRequestPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Create many HelpRequests.
     * @param {HelpRequestCreateManyArgs} args - Arguments to create many HelpRequests.
     * @example
     * // Create many HelpRequests
     * const helpRequest = await prisma.helpRequest.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     */
    createMany<T extends HelpRequestCreateManyArgs>(args?: Prisma.SelectSubset<T, HelpRequestCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Create many HelpRequests and returns the data saved in the database.
     * @param {HelpRequestCreateManyAndReturnArgs} args - Arguments to create many HelpRequests.
     * @example
     * // Create many HelpRequests
     * const helpRequest = await prisma.helpRequest.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Create many HelpRequests and only return the `id`
     * const helpRequestWithIdOnly = await prisma.helpRequest.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     *
     */
    createManyAndReturn<T extends HelpRequestCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, HelpRequestCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$HelpRequestPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    /**
     * Delete a HelpRequest.
     * @param {HelpRequestDeleteArgs} args - Arguments to delete one HelpRequest.
     * @example
     * // Delete one HelpRequest
     * const HelpRequest = await prisma.helpRequest.delete({
     *   where: {
     *     // ... filter to delete one HelpRequest
     *   }
     * })
     *
     */
    delete<T extends HelpRequestDeleteArgs>(args: Prisma.SelectSubset<T, HelpRequestDeleteArgs<ExtArgs>>): Prisma.Prisma__HelpRequestClient<runtime.Types.Result.GetResult<Prisma.$HelpRequestPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Update one HelpRequest.
     * @param {HelpRequestUpdateArgs} args - Arguments to update one HelpRequest.
     * @example
     * // Update one HelpRequest
     * const helpRequest = await prisma.helpRequest.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    update<T extends HelpRequestUpdateArgs>(args: Prisma.SelectSubset<T, HelpRequestUpdateArgs<ExtArgs>>): Prisma.Prisma__HelpRequestClient<runtime.Types.Result.GetResult<Prisma.$HelpRequestPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Delete zero or more HelpRequests.
     * @param {HelpRequestDeleteManyArgs} args - Arguments to filter HelpRequests to delete.
     * @example
     * // Delete a few HelpRequests
     * const { count } = await prisma.helpRequest.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     *
     */
    deleteMany<T extends HelpRequestDeleteManyArgs>(args?: Prisma.SelectSubset<T, HelpRequestDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Update zero or more HelpRequests.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {HelpRequestUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many HelpRequests
     * const helpRequest = await prisma.helpRequest.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    updateMany<T extends HelpRequestUpdateManyArgs>(args: Prisma.SelectSubset<T, HelpRequestUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Update zero or more HelpRequests and returns the data updated in the database.
     * @param {HelpRequestUpdateManyAndReturnArgs} args - Arguments to update many HelpRequests.
     * @example
     * // Update many HelpRequests
     * const helpRequest = await prisma.helpRequest.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Update zero or more HelpRequests and only return the `id`
     * const helpRequestWithIdOnly = await prisma.helpRequest.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     *
     */
    updateManyAndReturn<T extends HelpRequestUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, HelpRequestUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$HelpRequestPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    /**
     * Create or update one HelpRequest.
     * @param {HelpRequestUpsertArgs} args - Arguments to update or create a HelpRequest.
     * @example
     * // Update or create a HelpRequest
     * const helpRequest = await prisma.helpRequest.upsert({
     *   create: {
     *     // ... data to create a HelpRequest
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the HelpRequest we want to update
     *   }
     * })
     */
    upsert<T extends HelpRequestUpsertArgs>(args: Prisma.SelectSubset<T, HelpRequestUpsertArgs<ExtArgs>>): Prisma.Prisma__HelpRequestClient<runtime.Types.Result.GetResult<Prisma.$HelpRequestPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Count the number of HelpRequests.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {HelpRequestCountArgs} args - Arguments to filter HelpRequests to count.
     * @example
     * // Count the number of HelpRequests
     * const count = await prisma.helpRequest.count({
     *   where: {
     *     // ... the filter for the HelpRequests we want to count
     *   }
     * })
    **/
    count<T extends HelpRequestCountArgs>(args?: Prisma.Subset<T, HelpRequestCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], HelpRequestCountAggregateOutputType> : number>;
    /**
     * Allows you to perform aggregations operations on a HelpRequest.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {HelpRequestAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends HelpRequestAggregateArgs>(args: Prisma.Subset<T, HelpRequestAggregateArgs>): Prisma.PrismaPromise<GetHelpRequestAggregateType<T>>;
    /**
     * Group by HelpRequest.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {HelpRequestGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     *
    **/
    groupBy<T extends HelpRequestGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: HelpRequestGroupByArgs['orderBy'];
    } : {
        orderBy?: HelpRequestGroupByArgs['orderBy'];
    }, OrderFields extends Prisma.ExcludeUnderscoreKeys<Prisma.Keys<Prisma.MaybeTupleToUnion<T['orderBy']>>>, ByFields extends Prisma.MaybeTupleToUnion<T['by']>, ByValid extends Prisma.Has<ByFields, OrderFields>, HavingFields extends Prisma.GetHavingFields<T['having']>, HavingValid extends Prisma.Has<ByFields, HavingFields>, ByEmpty extends T['by'] extends never[] ? Prisma.True : Prisma.False, InputErrors extends ByEmpty extends Prisma.True ? `Error: "by" must not be empty.` : HavingValid extends Prisma.False ? {
        [P in HavingFields]: P extends ByFields ? never : P extends string ? `Error: Field "${P}" used in "having" needs to be provided in "by".` : [
            Error,
            'Field ',
            P,
            ` in "having" needs to be provided in "by"`
        ];
    }[HavingFields] : 'take' extends Prisma.Keys<T> ? 'orderBy' extends Prisma.Keys<T> ? ByValid extends Prisma.True ? {} : {
        [P in OrderFields]: P extends ByFields ? never : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
    }[OrderFields] : 'Error: If you provide "take", you also need to provide "orderBy"' : 'skip' extends Prisma.Keys<T> ? 'orderBy' extends Prisma.Keys<T> ? ByValid extends Prisma.True ? {} : {
        [P in OrderFields]: P extends ByFields ? never : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
    }[OrderFields] : 'Error: If you provide "skip", you also need to provide "orderBy"' : ByValid extends Prisma.True ? {} : {
        [P in OrderFields]: P extends ByFields ? never : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, HelpRequestGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetHelpRequestGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    /**
     * Fields of the HelpRequest model
     */
    readonly fields: HelpRequestFieldRefs;
}
/**
 * The delegate class that acts as a "Promise-like" for HelpRequest.
 * Why is this prefixed with `Prisma__`?
 * Because we want to prevent naming conflicts as mentioned in
 * https://github.com/prisma/prisma-client-js/issues/707
 */
export interface Prisma__HelpRequestClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
/**
 * Fields of the HelpRequest model
 */
export interface HelpRequestFieldRefs {
    readonly id: Prisma.FieldRef<"HelpRequest", 'String'>;
    readonly userId: Prisma.FieldRef<"HelpRequest", 'String'>;
    readonly subject: Prisma.FieldRef<"HelpRequest", 'String'>;
    readonly message: Prisma.FieldRef<"HelpRequest", 'String'>;
    readonly phoneNumber: Prisma.FieldRef<"HelpRequest", 'String'>;
    readonly status: Prisma.FieldRef<"HelpRequest", 'HelpStatus'>;
    readonly assignedTo: Prisma.FieldRef<"HelpRequest", 'String'>;
    readonly resolvedAt: Prisma.FieldRef<"HelpRequest", 'DateTime'>;
    readonly createdAt: Prisma.FieldRef<"HelpRequest", 'DateTime'>;
    readonly updatedAt: Prisma.FieldRef<"HelpRequest", 'DateTime'>;
}
/**
 * HelpRequest findUnique
 */
export type HelpRequestFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the HelpRequest
     */
    select?: Prisma.HelpRequestSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the HelpRequest
     */
    omit?: Prisma.HelpRequestOmit<ExtArgs> | null;
    /**
     * Filter, which HelpRequest to fetch.
     */
    where: Prisma.HelpRequestWhereUniqueInput;
};
/**
 * HelpRequest findUniqueOrThrow
 */
export type HelpRequestFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the HelpRequest
     */
    select?: Prisma.HelpRequestSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the HelpRequest
     */
    omit?: Prisma.HelpRequestOmit<ExtArgs> | null;
    /**
     * Filter, which HelpRequest to fetch.
     */
    where: Prisma.HelpRequestWhereUniqueInput;
};
/**
 * HelpRequest findFirst
 */
export type HelpRequestFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the HelpRequest
     */
    select?: Prisma.HelpRequestSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the HelpRequest
     */
    omit?: Prisma.HelpRequestOmit<ExtArgs> | null;
    /**
     * Filter, which HelpRequest to fetch.
     */
    where?: Prisma.HelpRequestWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of HelpRequests to fetch.
     */
    orderBy?: Prisma.HelpRequestOrderByWithRelationInput | Prisma.HelpRequestOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for HelpRequests.
     */
    cursor?: Prisma.HelpRequestWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` HelpRequests from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` HelpRequests.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of HelpRequests.
     */
    distinct?: Prisma.HelpRequestScalarFieldEnum | Prisma.HelpRequestScalarFieldEnum[];
};
/**
 * HelpRequest findFirstOrThrow
 */
export type HelpRequestFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the HelpRequest
     */
    select?: Prisma.HelpRequestSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the HelpRequest
     */
    omit?: Prisma.HelpRequestOmit<ExtArgs> | null;
    /**
     * Filter, which HelpRequest to fetch.
     */
    where?: Prisma.HelpRequestWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of HelpRequests to fetch.
     */
    orderBy?: Prisma.HelpRequestOrderByWithRelationInput | Prisma.HelpRequestOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for HelpRequests.
     */
    cursor?: Prisma.HelpRequestWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` HelpRequests from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` HelpRequests.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of HelpRequests.
     */
    distinct?: Prisma.HelpRequestScalarFieldEnum | Prisma.HelpRequestScalarFieldEnum[];
};
/**
 * HelpRequest findMany
 */
export type HelpRequestFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the HelpRequest
     */
    select?: Prisma.HelpRequestSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the HelpRequest
     */
    omit?: Prisma.HelpRequestOmit<ExtArgs> | null;
    /**
     * Filter, which HelpRequests to fetch.
     */
    where?: Prisma.HelpRequestWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of HelpRequests to fetch.
     */
    orderBy?: Prisma.HelpRequestOrderByWithRelationInput | Prisma.HelpRequestOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for listing HelpRequests.
     */
    cursor?: Prisma.HelpRequestWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` HelpRequests from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` HelpRequests.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of HelpRequests.
     */
    distinct?: Prisma.HelpRequestScalarFieldEnum | Prisma.HelpRequestScalarFieldEnum[];
};
/**
 * HelpRequest create
 */
export type HelpRequestCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the HelpRequest
     */
    select?: Prisma.HelpRequestSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the HelpRequest
     */
    omit?: Prisma.HelpRequestOmit<ExtArgs> | null;
    /**
     * The data needed to create a HelpRequest.
     */
    data: Prisma.XOR<Prisma.HelpRequestCreateInput, Prisma.HelpRequestUncheckedCreateInput>;
};
/**
 * HelpRequest createMany
 */
export type HelpRequestCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * The data used to create many HelpRequests.
     */
    data: Prisma.HelpRequestCreateManyInput | Prisma.HelpRequestCreateManyInput[];
    skipDuplicates?: boolean;
};
/**
 * HelpRequest createManyAndReturn
 */
export type HelpRequestCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the HelpRequest
     */
    select?: Prisma.HelpRequestSelectCreateManyAndReturn<ExtArgs> | null;
    /**
     * Omit specific fields from the HelpRequest
     */
    omit?: Prisma.HelpRequestOmit<ExtArgs> | null;
    /**
     * The data used to create many HelpRequests.
     */
    data: Prisma.HelpRequestCreateManyInput | Prisma.HelpRequestCreateManyInput[];
    skipDuplicates?: boolean;
};
/**
 * HelpRequest update
 */
export type HelpRequestUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the HelpRequest
     */
    select?: Prisma.HelpRequestSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the HelpRequest
     */
    omit?: Prisma.HelpRequestOmit<ExtArgs> | null;
    /**
     * The data needed to update a HelpRequest.
     */
    data: Prisma.XOR<Prisma.HelpRequestUpdateInput, Prisma.HelpRequestUncheckedUpdateInput>;
    /**
     * Choose, which HelpRequest to update.
     */
    where: Prisma.HelpRequestWhereUniqueInput;
};
/**
 * HelpRequest updateMany
 */
export type HelpRequestUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * The data used to update HelpRequests.
     */
    data: Prisma.XOR<Prisma.HelpRequestUpdateManyMutationInput, Prisma.HelpRequestUncheckedUpdateManyInput>;
    /**
     * Filter which HelpRequests to update
     */
    where?: Prisma.HelpRequestWhereInput;
    /**
     * Limit how many HelpRequests to update.
     */
    limit?: number;
};
/**
 * HelpRequest updateManyAndReturn
 */
export type HelpRequestUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the HelpRequest
     */
    select?: Prisma.HelpRequestSelectUpdateManyAndReturn<ExtArgs> | null;
    /**
     * Omit specific fields from the HelpRequest
     */
    omit?: Prisma.HelpRequestOmit<ExtArgs> | null;
    /**
     * The data used to update HelpRequests.
     */
    data: Prisma.XOR<Prisma.HelpRequestUpdateManyMutationInput, Prisma.HelpRequestUncheckedUpdateManyInput>;
    /**
     * Filter which HelpRequests to update
     */
    where?: Prisma.HelpRequestWhereInput;
    /**
     * Limit how many HelpRequests to update.
     */
    limit?: number;
};
/**
 * HelpRequest upsert
 */
export type HelpRequestUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the HelpRequest
     */
    select?: Prisma.HelpRequestSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the HelpRequest
     */
    omit?: Prisma.HelpRequestOmit<ExtArgs> | null;
    /**
     * The filter to search for the HelpRequest to update in case it exists.
     */
    where: Prisma.HelpRequestWhereUniqueInput;
    /**
     * In case the HelpRequest found by the `where` argument doesn't exist, create a new HelpRequest with this data.
     */
    create: Prisma.XOR<Prisma.HelpRequestCreateInput, Prisma.HelpRequestUncheckedCreateInput>;
    /**
     * In case the HelpRequest was found with the provided `where` argument, update it with this data.
     */
    update: Prisma.XOR<Prisma.HelpRequestUpdateInput, Prisma.HelpRequestUncheckedUpdateInput>;
};
/**
 * HelpRequest delete
 */
export type HelpRequestDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the HelpRequest
     */
    select?: Prisma.HelpRequestSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the HelpRequest
     */
    omit?: Prisma.HelpRequestOmit<ExtArgs> | null;
    /**
     * Filter which HelpRequest to delete.
     */
    where: Prisma.HelpRequestWhereUniqueInput;
};
/**
 * HelpRequest deleteMany
 */
export type HelpRequestDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Filter which HelpRequests to delete
     */
    where?: Prisma.HelpRequestWhereInput;
    /**
     * Limit how many HelpRequests to delete.
     */
    limit?: number;
};
/**
 * HelpRequest without action
 */
export type HelpRequestDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the HelpRequest
     */
    select?: Prisma.HelpRequestSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the HelpRequest
     */
    omit?: Prisma.HelpRequestOmit<ExtArgs> | null;
};
//# sourceMappingURL=HelpRequest.d.ts.map