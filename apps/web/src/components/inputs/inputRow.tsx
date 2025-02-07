"use client";
import {
    ActionIcon,
    Badge,
    Box,
    Collapse,
    Group,
    Paper,
    Table,
    Text,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import prettyMilliseconds from "pretty-ms";
import { FC } from "react";
import { TbArrowRight, TbFileText, TbX } from "react-icons/tb";
import { Address as AddressType, formatUnits } from "viem";
import { InputItemFragment } from "../../graphql/explorer/operations";
import Address from "../address";
import InputDetailsView from "./inputDetailsView";
import { methodResolver } from "../../lib/methodResolver";

export type InputRowProps = {
    input: InputItemFragment;
    timeType: string;
    keepDataColVisible: boolean;
};

const InputRow: FC<InputRowProps> = ({
    input,
    timeType,
    keepDataColVisible,
}) => {
    const [opened, { toggle }] = useDisclosure(false);
    const from = input.msgSender as AddressType;
    const to = input.application.id as AddressType;

    const erc20Deposit = (input: InputItemFragment) =>
        input.erc20Deposit ? (
            <Text size="xs">
                {formatUnits(
                    input.erc20Deposit.amount,
                    input.erc20Deposit.token.decimals,
                )}{" "}
                {input.erc20Deposit.token.symbol}
            </Text>
        ) : (
            <></>
        );

    const method = (
        <Badge variant="default" style={{ textTransform: "none" }}>
            {methodResolver(input) ?? "?"}
        </Badge>
    );
    return (
        <>
            <Table.Tr>
                <Table.Td>
                    <Box
                        display="flex"
                        w="max-content"
                        style={{
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        {input.erc20Deposit ? (
                            <Group>
                                <Address
                                    value={
                                        input.erc20Deposit.from as AddressType
                                    }
                                    icon
                                    shorten
                                />
                                <TbArrowRight />
                                <Address value={from} icon shorten />
                            </Group>
                        ) : (
                            <Address value={from} icon shorten />
                        )}
                    </Box>
                </Table.Td>
                <Table.Td>
                    <Box
                        display="flex"
                        w="max-content"
                        style={{
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        <Group justify="right">
                            {erc20Deposit(input)}
                            <TbArrowRight />
                        </Group>
                    </Box>
                </Table.Td>
                <Table.Td>
                    <Box
                        display="flex"
                        w="max-content"
                        style={{
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        <Address
                            value={to}
                            icon
                            href={`/applications/${to}/inputs`}
                            shorten
                        />
                    </Box>
                </Table.Td>
                <Table.Td>{method}</Table.Td>
                <Table.Td>
                    <Text>{input.index}</Text>
                </Table.Td>
                <Table.Td>
                    <Box
                        display="flex"
                        w="max-content"
                        style={{
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        <Text>
                            {timeType === "age"
                                ? `${prettyMilliseconds(
                                      Date.now() - input.timestamp * 1000,
                                      {
                                          unitCount: 2,
                                          secondsDecimalDigits: 0,
                                          verbose: true,
                                      },
                                  )} ago`
                                : new Date(
                                      input.timestamp * 1000,
                                  ).toISOString()}
                        </Text>
                    </Box>
                </Table.Td>
                <Table.Td
                    pos={keepDataColVisible ? "initial" : "sticky"}
                    top={0}
                    right={0}
                    p={0}
                >
                    <Paper
                        shadow={keepDataColVisible ? undefined : "xl"}
                        radius={0}
                        p="var(--table-vertical-spacing) var(--table-horizontal-spacing, var(--mantine-spacing-xs))"
                    >
                        <ActionIcon variant="default" onClick={toggle}>
                            {opened ? <TbX /> : <TbFileText />}
                        </ActionIcon>
                    </Paper>
                </Table.Td>
            </Table.Tr>
            <Table.Tr></Table.Tr>
            <Table.Tr>
                <Table.Td colSpan={8} p={0}>
                    <Collapse in={opened}>
                        {opened && <InputDetailsView input={input} />}
                    </Collapse>
                </Table.Td>
            </Table.Tr>
        </>
    );
};

export default InputRow;
